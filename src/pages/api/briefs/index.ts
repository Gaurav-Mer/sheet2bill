/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/briefs/index.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { checkUserLimit } from '@/lib/server-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    if (!user || authError) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
        clientId, lineItems, title, currency, notes,
        subtotal, tax_rate, tax_amount, total, due_date,
        is_password_protected, access_password, template_id,
        issue_date,
        service_start_date,
        delivery_date,
        create_as_invoice // Flag from Frontend
    } = req.body;

    if (!clientId || !lineItems || !lineItems.length || !title) {
        return res.status(400).json({ message: 'Client, title, and line items are required.' });
    }

    try {
        const limitCheck = await checkUserLimit(supabase, user.id, 'create_brief');
        if (!limitCheck.allowed) {
            return res.status(402).json({ message: limitCheck.message });
        }

        // --- 1. Generate Brief Number ---
        const { data: lastBrief } = await supabase
            .from('briefs')
            .select('brief_number')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        let nextBriefNum = 1;
        if (lastBrief?.brief_number) {
            const lastNum = parseInt(lastBrief.brief_number.split('-')[1]);
            if (!isNaN(lastNum)) nextBriefNum = lastNum + 1;
        }
        const newBriefNumber = `BRIEF-${String(nextBriefNum).padStart(4, '0')}`;

        // --- 2. Insert Brief ---
        const briefToInsert: any = {
            client_id: clientId,
            user_id: user.id,
            // If creating directly as invoice, we mark brief as 'invoiced' so it doesn't look pending
            status: create_as_invoice ? 'invoiced' : 'draft',
            title, currency, notes, subtotal, tax_rate, tax_amount, total, due_date,
            brief_number: newBriefNumber,
            is_password_protected: is_password_protected || false,
            template_id: template_id || "zurich",
            issue_date: issue_date,
            service_start_date: service_start_date ?? null,
            delivery_date: delivery_date ?? null,
        };

        if (is_password_protected && access_password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(access_password, saltRounds);
            briefToInsert.access_password = hashedPassword;
        }

        const { data: briefData, error: briefError } = await supabase
            .from('briefs')
            .insert(briefToInsert)
            .select()
            .single();

        if (briefError) throw briefError;

        // --- 3. Insert Brief Line Items ---
        const preparedLineItems = lineItems.map((item: any) => ({
            brief_id: briefData.id,
            user_id: user.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            item_id: item.item_id || null,
        }));

        const { error: lineItemsError } = await supabase
            .from('line_items')
            .insert(preparedLineItems);

        if (lineItemsError) throw lineItemsError;

        // --- 4. OPTIONAL: Generate Invoice (If Requested) ---
        let invoiceData = null;

        if (create_as_invoice) {
            // A. Generate Invoice Number (Checking 'invoices' table now)
            const { count } = await supabase
                .from('invoices')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const nextInvNum = (count || 0) + 1;
            const newInvoiceNumber = `INV-${String(nextInvNum).padStart(4, '0')}`;

            // B. Create Invoice Record
            const { data: inv, error: invError } = await supabase
                .from('invoices')
                .insert({
                    user_id: user.id,
                    client_id: clientId,
                    brief_id: briefData.id, // Link to the brief we just created
                    status: 'draft',
                    invoice_number: newInvoiceNumber,
                    issue_date: issue_date || new Date().toISOString(),
                    due_date: due_date,
                    currency, subtotal, tax_rate, tax_amount, total, notes,
                    template_id: template_id || 'zurich',
                    service_start_date: service_start_date ?? null,
                    delivery_date: delivery_date ?? null
                })
                .select()
                .single();

            if (invError) throw invError;
            invoiceData = inv;

            // C. Create Invoice Line Items
            const invoiceItems = lineItems.map((item: any) => ({
                invoice_id: inv.id,
                user_id: user.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
            }));

            const { error: invItemsError } = await supabase
                .from('invoice_line_items')
                .insert(invoiceItems);

            if (invItemsError) throw invItemsError;
        }

        // Return both brief and invoice data (if created)
        return res.status(201).json({
            brief: briefData,
            invoice: invoiceData
        });

    } catch (error: any) {
        console.error("Error creating brief/invoice:", error);
        // If 402 was thrown inside limit check, propagate it
        const status = error.message?.includes('limit') ? 402 : 500;
        return res.status(status).json({ message: error.message || "Internal Server Error" });
    }
}