// pages/api/templates/index.ts
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

    const { name, settings } = req.body;

    if (!name || !settings) {
        return res.status(400).json({ message: 'Name and settings are required.' });
    }

    const { data, error } = await supabase
        .from('invoice_templates')
        .insert({
            user_id: user.id,
            name,
            settings,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating template:", error);
        return res.status(500).json({ message: 'Error creating template', error });
    }

    return res.status(201).json(data);
}