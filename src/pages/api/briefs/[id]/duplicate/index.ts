/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const { id: originalBriefId } = req.query;

    try {
        // 1. Fetch the original brief and its line items to copy them.
        const { data: originalBrief, error: fetchError } = await supabase
            .from('briefs')
            .select('*, line_items(*)')
            .eq('id', originalBriefId)
            .eq('user_id', session.user.id)
            .single();

        if (fetchError || !originalBrief) {
            throw new Error('Original brief not found or permission denied.');
        }

        // 2. Destructure the original brief to safely separate unwanted fields.
        const { line_items, ...restOfBrief } = originalBrief;

        // 3. Auto-generate a new brief number.
        const { count } = await supabase.from('briefs').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
        const newBriefNumber = `BRIEF-${String((count || 0) + 1).padStart(4, '0')}`;

        // 4. Build a clean object for the new brief.
        const newBriefData = {
            ...restOfBrief, // This copies client_id, notes, tax_rate, total, etc.
            user_id: session.user.id,
            status: 'draft', // A duplicated brief always starts as a draft.
            title: `${originalBrief.title} (Copy)`,
            brief_number: newBriefNumber,
            issue_date: new Date().toISOString().split('T')[0], // Set issue date to today.
        };

        // 5. Create the new brief in the database.
        const { data: newBrief, error: insertBriefError } = await supabase
            .from('briefs')
            .insert(newBriefData)
            .select('id')
            .single();

        if (insertBriefError) throw insertBriefError;

        // 6. Copy the line items to the new brief.
        if (line_items && line_items.length > 0) {
            const new_line_items = line_items.map((item: any) => ({
                brief_id: newBrief.id,
                user_id: session.user.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
            }));
            const { error: lineItemsError } = await supabase.from('line_items').insert(new_line_items);
            if (lineItemsError) throw lineItemsError;
        }

        // 7. Success! Return the ID of the newly created brief.
        return res.status(201).json({ newBriefId: newBrief.id });

    } catch (error: any) {
        console.error("Error duplicating brief:", error);
        return res.status(500).json({ message: error.message });
    }
}

