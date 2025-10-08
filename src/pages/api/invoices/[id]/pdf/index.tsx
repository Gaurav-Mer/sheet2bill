/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/invoices/[id]/pdf.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToStaticMarkup } from 'react-dom/server';
import InvoiceTemplate from '@/components/invoices/InvoiceTemplate';
// import chromium from 'chrome-aws-lambda';
const playwright = await import("playwright-core");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.query;

    try {
        // 1. Fetch all necessary data
        const [invoiceQuery, profileQuery] = await Promise.all([
            supabase.from('invoices').select('*, client:clients!client_id(*), invoice_line_items(*)').eq('id', id).single(),
            supabase.from('profiles').select('*').eq('id', session.user.id).single()
        ]);

        const { data: invoiceData, error: invoiceError } = invoiceQuery;
        const { data: profileData, error: profileError } = profileQuery;

        if (invoiceError || profileError || !invoiceData || !profileData) {
            return res.status(404).send('Invoice or profile not found');
        }

        const fullInvoiceData = { ...invoiceData, profile: profileData, client: invoiceData.client };

        // 2. Render React component to HTML
        const html = renderToStaticMarkup(<InvoiceTemplate data={fullInvoiceData as any} />);

        // --- THIS IS THE CORRECTED SECTION ---
        // 3. Get the browser executable path

        // const executablePath = await chromium.executablePath;

        // 4. Launch a headless browser with the correct path
        // const browser = await playwright.chromium.launch({
        //     args: chromium.args,
        //     executablePath: executablePath || undefined, // Use the path, or undefined if not found
        //     headless: chromium.headless,
        // });

        const browser = await playwright.chromium.launch({
            headless: true,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        });

        // --- END OF CORRECTION ---

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // 5. Send the PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoice_number}.pdf`);
        return res.send(pdf);

    } catch (err: any) {
        console.error("Error generating PDF:", err);
        return res.status(500).send('Error generating PDF');
    }
}