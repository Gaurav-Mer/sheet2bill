// pages/api/templates/[id].ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).end('Method Not Allowed');
    }

    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.query;
    const { name, settings } = req.body;

    if (!name || !settings) {
        return res.status(400).json({ message: 'Name and settings are required.' });
    }

    const { data, error } = await supabase
        .from('invoice_templates')
        .update({ name, settings })
        .eq('id', id)
        .eq('user_id', user.id) // Security check
        .select()
        .single();

    if (error) {
        console.error("Error updating template:", error);
        return res.status(500).json({ message: 'Error updating template', error });
    }

    return res.status(200).json(data);
}