// pages/api/notifications/index.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end('Method Not Allowed');
    }

    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) return res.status(401).json({ message: 'Unauthorized' });

    // Fetch the 15 most recent notifications for the user
    const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(15);

    // Also fetch the count of unread notifications for the "red dot"
    const { count: unreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) {
        return res.status(500).json({ message: "Error fetching notifications", error });
    }

    return res.status(200).json({ notifications: notifications || [], unreadCount: unreadCount || 0 });
}