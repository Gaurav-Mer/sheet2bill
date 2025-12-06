/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const supabase = createPagesServerClient({ req, res });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { player_id } = req.body;

    if (!player_id) {
        return res.status(400).json({ message: "Player ID required" });
    }

    try {
        // Fetch current IDs
        const { data: profile } = await supabase
            .from("profiles")
            .select("onesignal_ids")
            .eq("id", user.id)
            .single();

        const current = profile?.onesignal_ids || [];

        // Remove the ID
        const updated = current.filter((id: string) => id !== player_id);

        await supabase
            .from("profiles")
            .update({ onesignal_ids: updated })
            .eq("id", user.id);

        return res.status(200).json({ success: true });
    } catch (e: any) {
        return res.status(500).json({ error: e.message });
    }
}
