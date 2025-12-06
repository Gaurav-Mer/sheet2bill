/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("request    received at /api/push_notification/subscribe");
    if (req.method !== 'POST') return res.status(405).end();

    const supabase = createPagesServerClient({ req, res });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { player_id } = req.body;

    if (!player_id) return res.status(400).json({ message: 'Player ID required' });

    try {
        // 1. Fetch current IDs
        const { data: profile } = await supabase
            .from('profiles')
            .select('onesignal_ids')
            .eq('id', user.id)
            .single();

        const currentIds = profile?.onesignal_ids || [];

        // 2. Avoid Duplicates
        if (currentIds.includes(player_id)) {
            return res.status(200).json({ message: 'Already subscribed' });
        }

        // 3. Rolling List: Keep only the last 3 devices to avoid clutter
        if (currentIds.length >= 3) {
            currentIds.shift(); // Remove the oldest one
        }

        // 4. Add new ID
        currentIds.push(player_id);

        // 5. Save back to DB
        const { error } = await supabase
            .from('profiles')
            .update({ onesignal_ids: currentIds })
            .eq('id', user.id);

        if (error) throw error;

        return res.status(200).json({ success: true });

    } catch (error: any) {
        console.error("Error subscribing:", error);
        return res.status(500).json({ error: error.message });
    }
}