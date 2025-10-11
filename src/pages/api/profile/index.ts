// pages/api/profile.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).end('Method Not Allowed');
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    // UPDATED: Destructure all the new fields from the request body
    const {
        full_name, company_name, avatar_url, phone_number,
        address_line_1, address_line_2, city, state_province_region,
        postal_code, country, tax_id,
        brand_color, // Add the brand_color to the upsert
        thank_u_note,
        default_currency

    } = req.body;

    // Use 'upsert' to update the profile with all the new data
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: session.user.id,
            updated_at: new Date().toISOString(),
            // Pass all the fields to be updated
            full_name, company_name, avatar_url, phone_number,
            address_line_1, address_line_2, city, state_province_region,
            postal_code, country, tax_id,
            brand_color, // Add the brand_color to the upsert
            thank_u_note,
            default_currency
        })
        .select()
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: 'Error updating profile', error });
    }

    return res.status(200).json(data);
}