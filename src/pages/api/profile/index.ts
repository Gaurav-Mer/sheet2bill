/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/profile.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
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

    // Destructure all the new fields from the request body
    // *** NEW: Renamed 'avatar_url' to 'new_avatar_url' for clarity ***
    const {
        full_name, company_name, avatar_url: new_avatar_url, phone_number,
        address_line_1, address_line_2, city, state_province_region,
        postal_code, country, tax_id,
        brand_color,
        thank_u_note,
        default_currency
    } = req.body;

    // --- NEW: Step 1: Fetch the current profile to get the old avatar URL ---
    const { data: old_profile, error: fetchError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

    // We can just log this error, but we'll still try to update the profile
    if (fetchError) {
        console.error("Error fetching old profile:", fetchError.message);
    }

    const old_avatar_url = old_profile?.avatar_url;

    // --- NEW: Step 2: If a new URL is provided and it's different, delete the old file ---
    if (new_avatar_url && old_avatar_url && new_avatar_url !== old_avatar_url) {
        try {

            // We use the "Manager's Key" (Admin Client) to delete the file.
            // Our "Service role can delete logos" policy will allow this.
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            const BUCKET_NAME = 'logos';

            // Parse the file path from the full URL
            const old_url = new URL(old_avatar_url);
            const path_parts = old_url.pathname.split('/');
            // The path is everything after the bucket name
            const file_path = path_parts.slice(path_parts.indexOf(BUCKET_NAME) + 1).join('/');

            if (file_path) {
                console.log(`Deleting old avatar: ${file_path}`);
                const { error: deleteError } = await supabaseAdmin.storage
                    .from(BUCKET_NAME)
                    .remove([file_path]);
                console.log("deleteError", deleteError)
                if (deleteError) {
                    // Log the error but don't stop the profile update
                    console.error("Failed to delete old avatar:", deleteError.message);
                }
            }
        } catch (e: any) {
            console.error("Error parsing old avatar URL or deleting file:", e.message);
        }
    }

    // --- Step 3: Use 'upsert' to update the profile with all the new data ---
    // (This is your original logic, just using 'new_avatar_url')
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            updated_at: new Date().toISOString(),
            full_name, company_name,
            avatar_url: new_avatar_url, // Pass the new URL to be saved
            phone_number,
            address_line_1, address_line_2, city, state_province_region,
            postal_code, country, tax_id,
            brand_color,
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