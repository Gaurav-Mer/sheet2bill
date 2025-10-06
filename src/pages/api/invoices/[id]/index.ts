import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.query;

    // --- HANDLE UPDATING AN INVOICE (e.g., changing status to 'paid') ---
    if (req.method === 'PATCH') {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'Status is required.' });

        const { data, error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', id)
            .eq('user_id', session.user.id) // Security check
            .select()
            .single();

        if (error) return res.status(500).json({ message: 'Error updating invoice', error });
        return res.status(200).json(data);
    }

    // --- HANDLE DELETING A DRAFT INVOICE ---
    if (req.method === 'DELETE') {
        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id) // Security check
            .eq('status', 'draft'); // Rule: Only allow deleting drafts

        if (error) return res.status(500).json({ message: 'Error deleting invoice', error });
        return res.status(204).end();
    }

    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}