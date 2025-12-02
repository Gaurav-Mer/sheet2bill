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

    // 1. Destructure ALL fields (Old Billing + New Storefront)
    const {
        // --- Existing Billing Fields ---
        full_name, company_name, avatar_url: new_avatar_url, phone_number,
        address_line_1, address_line_2, city, state_province_region,
        postal_code, country, tax_id,
        brand_color,
        thank_u_note,
        default_currency,

        // --- NEW Storefront Fields ---
        username,
        job_title,
        bio,
        skills, // This might come as "React, Node" (string) or ['React', 'Node'] (array)
        is_public,
        is_available,
        website,
        linkedin,
        twitter,
        github,
        instagram
    } = req.body;

    // --- NEW Helper: Ensure 'skills' is formatted as an Array for Postgres ---


    // --- Step 1: Fetch old profile for Avatar logic ---
    const { data: old_profile, error: fetchError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

    if (fetchError) {
        console.error("Error fetching old profile:", fetchError.message);
    }

    const old_avatar_url = old_profile?.avatar_url;

    // --- Step 2: Delete old avatar if changed ---
    if (new_avatar_url && old_avatar_url && new_avatar_url !== old_avatar_url) {
        try {
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            const BUCKET_NAME = 'logos';

            const old_url = new URL(old_avatar_url);
            const path_parts = old_url.pathname.split('/');
            const file_path = path_parts.slice(path_parts.indexOf(BUCKET_NAME) + 1).join('/');

            if (file_path) {
                console.log(`Deleting old avatar: ${file_path}`);
                const { error: deleteError } = await supabaseAdmin.storage
                    .from(BUCKET_NAME)
                    .remove([file_path]);

                if (deleteError) {
                    console.error("Failed to delete old avatar:", deleteError.message);
                }
            }
        } catch (e: any) {
            console.error("Error parsing old avatar URL or deleting file:", e.message);
        }
    }

    // --- Step 3: Upsert with ALL data ---
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            updated_at: new Date().toISOString(),

            // Billing Info
            full_name,
            company_name,
            avatar_url: new_avatar_url,
            phone_number,
            address_line_1, address_line_2, city, state_province_region,
            postal_code, country, tax_id,
            brand_color,
            thank_u_note,
            default_currency,

            // New Storefront Info
            username,
            job_title,
            bio,
            skills: skills, // Use the formatted array
            is_public,
            is_available,
            website,
            linkedin,
            twitter,
            github,
            instagram
        })
        .select()
        .single();

    if (error) {
        // Specific handling for Username Duplicate Error (Postgres Code 23505)
        if (error.code === '23505' && error.message?.includes('username')) {
            return res.status(409).json({ message: 'Username is already taken' });
        }

        console.error("Error updating profile:", error);
        return res.status(500).json({ message: 'Error updating profile', error });
    }

    return res.status(200).json(data);
}