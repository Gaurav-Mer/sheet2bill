// pages/api/notification/read.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { notification_id } = req.body || {};

        if (notification_id) {
            // 🔹 Mark one notification as read
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notification_id)
                .eq('user_id', session.user.id);

            if (error) throw error;

            return res.status(200).json({ message: 'Notification marked as read' });
        } else {
            // 🔹 Mark all notifications as read for this user
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', session.user.id);

            if (error) throw error;

            return res.status(200).json({ message: 'All notifications marked as read' });
        }

    } catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({ message: 'Error updating notifications', error });
    }
}
