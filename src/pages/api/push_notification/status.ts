// GET /api/notifications/status
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient({ req, res });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return res.status(401).json({});

    const { data: profile } = await supabase
        .from("profiles")
        .select("onesignal_ids")
        .eq("id", user.id)
        .single();

    return res.status(200).json({ ids: profile?.onesignal_ids || [] });
}
