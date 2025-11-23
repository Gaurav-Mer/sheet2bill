/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/briefs/index.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { checkPlanLimits } from '@/lib/permission';

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

    // MODIFIED: Destructure the new password fields from the body
    const {
        clientId, lineItems, title, currency, notes,
        subtotal, tax_rate, tax_amount, total, due_date,
        is_password_protected, access_password, template_id,
        issue_date
    } = req.body;

    if (!clientId || !lineItems || !lineItems.length || !title) {
        return res.status(400).json({ message: 'Client, title, and line items are required.' });
    }

    try {
        await checkPlanLimits(supabase, user.id, 'CREATE_BRIEF');

        // --- Auto-generate the brief_number ---
        const { data: lastBrief } = await supabase
            .from('briefs')
            .select('brief_number')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        let nextNumber = 1;
        if (lastBrief?.brief_number) {
            const lastNum = parseInt(lastBrief.brief_number.split('-')[1]);
            if (!isNaN(lastNum)) nextNumber = lastNum + 1;
        }
        const newBriefNumber = `BRIEF-${String(nextNumber).padStart(4, '0')}`;

        // Prepare the base brief data for insertion
        const briefToInsert: any = {
            client_id: clientId,
            user_id: user.id,
            status: 'draft',
            title, currency, notes, subtotal, tax_rate, tax_amount, total, due_date,
            brief_number: newBriefNumber,
            is_password_protected: is_password_protected || false,
            template_id: template_id || "zurich",
            issue_date: issue_date
        };

        // --- NEW: Handle Password Hashing ---
        // If the user wants password protection and provided a password, hash it.
        if (is_password_protected && access_password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(access_password, saltRounds);
            briefToInsert.access_password = hashedPassword;
        }

        // --- Database Transaction ---
        // 1. Insert the main brief data
        const { data: briefData, error: briefError } = await supabase
            .from('briefs')
            .insert(briefToInsert)
            .select()
            .single();

        if (briefError) throw briefError;

        // 2. Prepare and insert the associated line items
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

        // Success!
        return res.status(201).json(briefData);

    } catch (error: any) {
        console.error("Error creating brief:", error);
        return res.status(402).json({ message: error.message }); // 402 = Payment Required
    }
}