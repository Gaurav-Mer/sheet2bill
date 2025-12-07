import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendPushNotification } from '@/lib/helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { freelancer_id, client_name, service_count } = req.body;

    if (!freelancer_id) {
        return res.status(400).json({ message: 'Missing freelancer_id' });
    }

    try {
        // 1. Initialize Supabase Admin to fetch sensitive profile data (onesignal_ids)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Fetch the freelancer's OneSignal IDs
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('onesignal_ids')
            .eq('id', freelancer_id)
            .single();

        if (error || !profile) {
            console.warn(`Freelancer ${freelancer_id} not found or has no profile.`);
            return res.status(404).json({ message: 'Freelancer profile not found' });
        }

        // 3. Send the Push Notification
        if (profile.onesignal_ids && profile.onesignal_ids.length > 0) {
            const heading = "New Service Request! 🚀";
            const message = `${client_name} is requesting ${service_count} service${service_count > 1 ? 's' : ''}. Tap to view details.`;
            // Deep link to the inquiries page (adjust path as needed for your app)
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/inquiries`;

            await sendPushNotification(profile.onesignal_ids, heading, message, url);
        }

        return res.status(200).json({ message: 'Notification sent' });

    } catch (err) {
        console.error('Error sending inquiry notification:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}