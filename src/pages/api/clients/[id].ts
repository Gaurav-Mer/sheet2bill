// pages/api/clients/[id].ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;

    // --- HANDLE UPDATING A CLIENT (PUT request) ---
    if (req.method === 'PUT') {
        const { error } = await supabase
            .from('clients')
            .update(req.body) // Update with the data sent from the form
            .eq('id', id)
            .eq('user_id', session.user.id); // Security check

        if (error) {
            return res.status(500).json({ message: 'Error updating client', error });
        }
        return res.status(200).json({ message: 'Client updated successfully' });
    }

    // --- HANDLE DELETING A CLIENT (DELETE request) ---
    if (req.method === 'DELETE') {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id); // Security check

        if (error) {
            return res.status(500).json({ message: 'Error deleting client', error });
        }
        return res.status(204).end(); // 204 No Content for successful deletion
    }

    // Handle other methods
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}