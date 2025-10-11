/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/briefs/[id].ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

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

        const { data, error } = await supabase.from('briefs').update({ status, rejection_reason }).eq('id', id).select().single();
        if (error) return res.status(500).json({ message: 'Error updating status', error });

        // --- NEW: Notification Logic ---
        if (data) {
            try {
                const clientName = (data.clients as any)?.name || 'A client';
                const message = status === 'approved'
                    ? `${clientName} has approved your brief: "${data.title}"`
                    : `${clientName} has requested changes on your brief: "${data.title}"`;

                const link_to = status === 'rejected' ? `/briefs/${data.id}/edit` : '/briefs';

                // Insert a new row into the notifications table
                await supabase.from('notifications').insert({
                    user_id: data.user_id,
                    message: message,
                    link_to: link_to,
                });

            } catch (notificationError) {
                // Log the error but don't fail the whole request if notification fails
                console.error("Failed to create notification:", notificationError);
            }
        }
        // --- END OF NOTIFICATION LOGIC ---

        return res.status(200).json(data);
    }

    // --- HANDLE A LOGGED-IN USER DELETING THE BRIEF ---
    if (req.method === 'DELETE') {
        // (This section remains the same)
        const supabase = createPagesServerClient({ req, res });
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return res.status(401).json({ message: 'Unauthorized' });

        const { error } = await supabase.from('briefs').delete().eq('id', id);
        if (error) return res.status(500).json({ message: 'Error deleting brief', error });
        return res.status(204).end();
    }

    res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}