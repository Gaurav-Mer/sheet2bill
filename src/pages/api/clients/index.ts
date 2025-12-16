/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkUserLimit } from '@/lib/server-limit';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // --- THIS IS THE GATEKEEPER ---
        // Before we do anything else, we check if the user is allowed to perform this action.
        const limitCheck = await checkUserLimit(supabase, user.id, 'add_client');

        if (!limitCheck.allowed) {
            // Return 402 (Payment Required) so the frontend knows to show the Pricing Modal
            return res.status(402).json({ message: limitCheck.message });
        }

        const { name, ...clientData } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Client name is required.' });
        }

        const { data, error } = await supabase
            .from('clients')
            .insert({
                user_id: user.id,
                name,
                ...clientData
            })
            .select()
            .single();

        if (error) {
            // Specifically handle the duplicate email error
            if (error.code === '23505') {
                return res.status(409).json({ message: 'A client with this email already exists.' });
            }
            // For other database errors, re-throw to be caught by the outer catch block
            throw error;
        }

        return res.status(201).json(data);

    } catch (error: any) {
        // This catch block will now handle errors from our checkPlanLimits function
        // and any other unexpected database errors.

        // A 402 "Payment Required" status is the standard code for hitting a plan limit.
        return res.status(402).json({ message: error.message });
    }
}
