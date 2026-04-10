import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendInvoiceEmail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const supabase = createPagesServerClient({ req, res });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.query;

    // Fetch invoice with client and profile info
    const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select(`
            id, invoice_number, invoice_token, status, total, currency, due_date,
            client:clients!client_id(name, email),
            profile:profiles!user_id(full_name, company_name)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
    }

    const clientEmail = (invoice.client as { name: string; email: string } | null)?.email;
    const clientName = (invoice.client as { name: string; email: string } | null)?.name ?? 'there';

    if (!clientEmail) {
        return res.status(400).json({ message: 'Client has no email address.' });
    }

    const profile = invoice.profile as { full_name: string; company_name: string } | null;
    const fromName = profile?.company_name || profile?.full_name || 'Your Freelancer';

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;
    const invoiceUrl = `${baseUrl}/invoice/${invoice.invoice_token}`;

    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: invoice.currency || 'INR',
        minimumFractionDigits: 2,
    }).format(invoice.total);

    const formattedDueDate = invoice.due_date
        ? new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : undefined;
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS);
    try {
        await sendInvoiceEmail({
            to: clientEmail,
            clientName,
            invoiceNumber: invoice.invoice_number,
            amount: formattedAmount,
            invoiceUrl,
            fromName,
            dueDate: formattedDueDate,
        });
    } catch (err) {
        console.error('Failed to send invoice email:', err);
        return res.status(500).json({ message: 'Failed to send email. Check your SMTP settings.' });
    }

    // Mark as 'sent' if it was a draft
    if (invoice.status === 'draft') {
        await supabase
            .from('invoices')
            .update({ status: 'sent' })
            .eq('id', id)
            .eq('user_id', user.id);
    }

    return res.status(200).json({ message: 'Invoice sent successfully.' });
}
