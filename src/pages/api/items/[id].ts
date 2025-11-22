/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.query;

    // --- HANDLE UPDATING AN ITEM (PUT) ---
    if (req.method === 'PUT') {
        const { name, description, default_price } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Item name is required.' });
        }

        const { data, error } = await supabase
            .from('items')
            .update({
                name,
                description,
                default_price: default_price || 0,
            })
            .eq('id', id)
            .eq('user_id', session.user.id) // RLS-like check for security
            .select()
            .single();

        if (error) {
            console.error("Error updating item:", error);
            const errorMsg = error.code === '23503' ? 'You cannot delete this item because it is used in existing Briefs.' : 'Error updating item';
            return res.status(500).json({ message: errorMsg, error });
        }
        return res.status(200).json(data);
    }

    // --- HANDLE DELETING AN ITEM (DELETE) ---
    if (req.method === 'DELETE') {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id); // RLS-like check for security

        if (error) {
            console.error("Error deleting item:", error);
            const errorMsg = error.code === '23503' ? 'You cannot delete this item because it is used in existing Briefs.' : 'Error deleting item';
            return res.status(500).json({ message: errorMsg, error });
        }
        return res.status(204).end(); // 204 No Content (success)
    }

    // Handle other methods
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}