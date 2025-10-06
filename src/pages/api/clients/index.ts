// pages/api/clients.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Destructure all the possible fields from the request body
    const {
        name, email, phone_number, contact_person,
        address_line_1, city, state_province_region,
        postal_code, country, tax_id, notes
    } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Client name is required.' });
    }

    const { data, error } = await supabase
        .from('clients')
        .insert({
            // Map all fields to their database columns
            name, email, phone_number, contact_person,
            address_line_1, city, state_province_region,
            postal_code, country, tax_id, notes,
            user_id: session.user.id,
        })
        .select()
        .single(); // Using .single() is fine here as we insert one record

    if (error) {
        console.error('Detailed Supabase Error:', error);
        return res.status(500).json({ message: 'Error inserting client', error });
    }

    return res.status(201).json(data);
}