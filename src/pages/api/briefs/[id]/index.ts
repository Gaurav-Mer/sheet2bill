/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/briefs/[id].ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { Resend } from 'resend'; // 1. Import Resend

// 2. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    // --- HANDLE A LOGGED-IN USER EDITING THE ENTIRE BRIEF ---
    if (req.method === 'PUT') {
        const supabase = createPagesServerClient({ req, res });
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return res.status(401).json({ message: 'Unauthorized' });

        const { lineItems, is_password_protected, access_password, ...briefData } = req.body;

        try {
            const dataToUpdate: any = { ...briefData, is_password_protected };

            // --- NEW: Handle Password Hashing Logic ---
            // If user is enabling password protection and provides a password, hash it.
            if (is_password_protected && access_password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(access_password, saltRounds);
                dataToUpdate.access_password = hashedPassword;
            }
            // If user is disabling password protection, clear the password in the database.
            else if (!is_password_protected) {
                dataToUpdate.access_password = null;
            }

            // 1. Update the main 'briefs' table with the new data
            const { error: briefError } = await supabase.from('briefs').update(dataToUpdate).eq('id', id);
            if (briefError) throw briefError;

            // 2. Delete old line items and 3. Insert new ones
            if (lineItems && Array.isArray(lineItems)) {
                await supabase.from('line_items').delete().eq('brief_id', id);

                const preparedLineItems = lineItems.map((item: any) => ({
                    brief_id: id,
                    user_id: session.user.id,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                }));
                const { error: insertError } = await supabase.from('line_items').insert(preparedLineItems);
                if (insertError) throw insertError;
            }
            return res.status(200).json({ message: 'Brief updated successfully' });
        } catch (error) {
            console.error("Error updating brief:", error);
            return res.status(500).json({ message: 'Error updating brief', error });
        }
    }

    // --- HANDLE A PUBLIC CLIENT UPDATING THE STATUS ---
    if (req.method === 'PATCH') {
        // (This section remains the same)
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        const { status, rejection_reason } = req.body;
        if (!status) return res.status(400).json({ message: 'Status is required.' });

        const { data: updatedBrief, error } = await supabase
            .from('briefs')
            .update({ status, rejection_reason })
            .eq('id', id)
            .select('*, clients(name)')
            .single();

        if (error) {
            console.error("Error updating status:", error);
            return res.status(500).json({ message: 'Error updating status', error });
        }

        // --- THIS IS THE CORRECTED NOTIFICATION LOGIC ---
        if (updatedBrief) {
            const clientName = (updatedBrief.clients as any)?.name || 'A client';
            let subject = '';
            let message = '';
            const link_to = status === 'rejected' ? `/briefs/${updatedBrief.id}/edit` : '/briefs';

            if (status === 'approved') {
                subject = `✅ Your brief has been approved! (${updatedBrief.brief_number})`;
                message = `${clientName} has approved your brief: "${updatedBrief.title}"`;
            } else if (status === 'rejected') {
                subject = `🔴 Changes requested on your brief (${updatedBrief.brief_number})`;
                message = `${clientName} has requested changes on your brief: "${updatedBrief.title}"`;
            }

            // --- 1. Create In-App Notification (ALWAYS RUNS) ---
            // This is critical and must always happen.
            if (subject) { // We check for 'subject' to make sure it's an event we want to log
                try {
                    await supabase.from('notifications').insert({
                        user_id: updatedBrief.user_id,
                        message: message,
                        link_to: link_to,
                    });
                } catch (notificationError) {
                    console.error("Failed to create in-app notification:", notificationError);
                }
            }

            // --- 2. Send Email Notification (RUNS CONDITIONALLY) ---
            // Now, separately, we try to get the email and send.
            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('id', updatedBrief.user_id)
                    .single();

                const userEmail = profile?.email;

                if (userEmail && subject) {
                    await resend.emails.send({
                        from: 'Sheet2Bill <admin@sheet2bill.com>',
                        to: userEmail,
                        subject: subject,
                        html: `<p>${message}</p><p>You can view it here: ${process.env.NEXT_PUBLIC_BASE_URL}${link_to}</p>`,
                    });
                }
            } catch (emailError) {
                console.error("Failed to send email notification:", emailError);
            }
        }

        // const { data, error, updatedBrief } = await supabase.from('briefs').update({ status, rejection_reason }).eq('id', id).select().single();
        // if (error) return res.status(500).json({ message: 'Error updating status', error });

        // --- NEW: Notification Logic ---
        // if (data) {
        //     try {
        //         const clientName = (data.clients as any)?.name || 'A client';
        //         const message = status === 'approved'
        //             ? `${clientName} has approved your brief: "${data.title}"`
        //             : `${clientName} has requested changes on your brief: "${data.title}"`;

        //         const link_to = status === 'rejected' ? `/briefs/${data.id}/edit` : '/briefs';

        //         // Insert a new row into the notifications table
        //         await supabase.from('notifications').insert({
        //             user_id: data.user_id,
        //             message: message,
        //             link_to: link_to,
        //         });

        //     } catch (notificationError) {
        //         // Log the error but don't fail the whole request if notification fails
        //         console.error("Failed to create notification:", notificationError);
        //     }
        // }
        // --- END OF NOTIFICATION LOGIC ---

        return res.status(200).json(updatedBrief);
    }

    // --- HANDLE A LOGGED-IN USER DELETING THE BRIEF ---
    if (req.method === 'DELETE') {
        // (This section remains the same)
        const supabase = createPagesServerClient({ req, res });
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return res.status(401).json({ message: 'Unauthorized' });

        const { error } = await supabase.from('briefs').delete().eq('id', id);
        if (error) return res.status(500).json({ message: 'Error deleting brief', error });
        return res.status(204).json({ message: 'Brief deleted successfully' });
    }

    res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}