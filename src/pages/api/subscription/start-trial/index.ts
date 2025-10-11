/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // We only allow POST requests to this endpoint, as it changes data.
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // 1. SECURITY: Ensure the user is logged in.
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // 2. BUSINESS LOGIC: Fetch the user's current profile to check their status.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', session.user.id)
            .single();

        if (profileError) throw profileError;

        // 3. THE GATE: Only allow users on the 'free' plan to start a trial.
        // This prevents existing paid or trialing users from starting another trial.
        if (profile?.subscription_status !== 'free') {
            return res.status(403).json({ message: 'You are not eligible for a trial.' });
        }

        // 4. CALCULATE EXPIRATION: Set the trial end date to 7 days from now.
        const trialEnds = new Date();
        trialEnds.setDate(trialEnds.getDate() + 7);

        // 5. UPDATE DATABASE: Change the user's status and set the end date.
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
                subscription_status: 'trialing',
                subscription_ends_at: trialEnds.toISOString(),
            })
            .eq('id', session.user.id)
            .select()
            .single();

        if (updateError) throw updateError;

        // 6. SUCCESS: Return the updated profile.
        return res.status(200).json(updatedProfile);

    } catch (error: any) {
        console.error("Error starting trial:", error);
        return res.status(500).json({ message: error.message || "An internal error occurred." });
    }
}