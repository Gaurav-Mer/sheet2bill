/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/api/cron/overdue-reminders.ts
// Called by Vercel Cron daily at 9am IST (3:30 UTC).
// Sends reminder emails for invoices due today, 7 days ago, and 14 days ago.

import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendOverdueReminderEmail } from '@/lib/mailer';

function isoDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Allow GET (Vercel Cron) or POST (manual trigger)
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    // Protect endpoint with a secret header
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
        const authHeader = req.headers['authorization'];
        if (authHeader !== `Bearer ${cronSecret}`) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const today = new Date();
    const targetDays = [0, 7, 14]; // due today, 7 days overdue, 14 days overdue

    const results: { sent: number; errors: number; skipped: number } = {
        sent: 0,
        errors: 0,
        skipped: 0,
    };

    for (const daysOverdue of targetDays) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - daysOverdue);
        const dateStr = isoDateOnly(targetDate);

        // Fetch all sent invoices with this due date that aren't yet paid
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select(`
                id, invoice_number, invoice_token, total, currency, due_date, status,
                client:clients!client_id(name, email),
                profile:profiles!user_id(full_name, company_name)
            `)
            .eq('status', 'sent')
            .eq('due_date', dateStr);

        if (error) {
            console.error(`Error fetching invoices for ${dateStr}:`, error.message);
            results.errors++;
            continue;
        }

        if (!invoices || invoices.length === 0) continue;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sheet2bill.com';

        for (const invoice of invoices) {
            const client = invoice.client as { name: string; email?: string } | any;
            const profile = invoice.profile as { full_name?: string; company_name?: string } | null;

            if (!client?.email) {
                results.skipped++;
                continue;
            }

            const formattedAmount = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: invoice.currency || 'INR',
                minimumFractionDigits: 2,
            }).format(invoice.total);

            const formattedDueDate = new Date(invoice.due_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });

            try {
                await sendOverdueReminderEmail({
                    to: client.email,
                    clientName: client.name || 'there',
                    invoiceNumber: invoice.invoice_number,
                    amount: formattedAmount,
                    invoiceUrl: `${baseUrl}/invoice/${invoice.invoice_token}`,
                    fromName: profile?.company_name || profile?.full_name || 'Your Freelancer',
                    dueDate: formattedDueDate,
                    daysOverdue,
                });
                results.sent++;
            } catch (emailErr) {
                console.error(`Failed to send reminder for invoice ${invoice.invoice_number}:`, emailErr);
                results.errors++;
            }
        }
    }

    console.log('Overdue reminders result:', results);
    return res.status(200).json({ success: true, ...results });
}
