/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    if (!user || authError) return res.status(401).json({ message: 'Unauthorized' });

    const { brief_id } = req.body;
    if (!brief_id) return res.status(400).json({ message: 'Brief ID is required.' });

    try {
        // --- DATABASE TRANSACTION ---
        // 1. Fetch the approved brief and its line items to ensure it's valid.
        const { data: brief, error: fetchError } = await supabase
            .from('briefs')
            .select('*, line_items(*)')
            .eq('id', brief_id)
            .eq('user_id', user.id)
            .eq('status', 'approved')
            .single();

        if (fetchError || !brief) {
            throw new Error('Approved brief not found or you do not have permission.');
        }

        // 2. Auto-generate the new invoice number.
        const { count } = await supabase.from('invoices').select('invoice_number', { count: 'exact', head: true }).eq('user_id', user.id);
        const nextNumber = (count || 0) + 1;
        const newInvoiceNumber = `INV-${String(nextNumber).padStart(4, '0')}`;

        // 3. Create the new invoice record by copying data from the brief.
        const { data: newInvoice, error: invoiceError } = await supabase
            .from('invoices')
            .insert({
                user_id: user.id,
                client_id: brief.client_id,
                brief_id: brief.id,
                status: 'draft', // Invoices are always created as 'draft' first
                invoice_number: newInvoiceNumber,
                issue_date: brief.issue_date ?? new Date().toISOString().split('T')[0],
                due_date: brief.due_date,
                currency: brief.currency,
                subtotal: brief.subtotal,
                tax_rate: brief.tax_rate,
                tax_amount: brief.tax_amount,
                total: brief.total,
                notes: brief.notes ?? "",
                template_id: brief.template_id || 'zurich', // Default to 'zurich' if none
            })
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        // 4. Copy the line items from the brief to the new invoice.
        const newInvoiceLineItems = brief.line_items.map((item: any) => ({
            invoice_id: newInvoice.id,
            user_id: user.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
        }));
        const { error: lineItemsError } = await supabase.from('invoice_line_items').insert(newInvoiceLineItems);
        if (lineItemsError) throw lineItemsError;

        // 5. Update the original brief's status to 'invoiced' to close the loop.
        await supabase.from('briefs').update({ status: 'invoiced' }).eq('id', brief.id);

        return res.status(201).json(newInvoice);

    } catch (error: any) {
        console.error("Error converting brief to invoice:", error);
        return res.status(500).json({ message: error.message });
    }
}