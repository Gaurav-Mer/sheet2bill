/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/invoices/[id]/pdf.tsx
import { createClient } from '@supabase/supabase-js'; // Import the standard client
import { NextApiRequest, NextApiResponse } from 'next';
import { renderToStaticMarkup } from 'react-dom/server';
import playwright from 'playwright-core';

// Import our template definitions
import { AVAILABLE_TEMPLATES } from '@/lib/templates';
import { TemplateSettings } from '@/types';
import { CurrentTemplate } from '@/components/templates/CurrentTemplate';

async function getBrowserConfig() {
    if (process.env.NODE_ENV === 'production') {
        const chromium = await import('@sparticuz/chromium-min');
        return {
            args: chromium.default.args,
            executablePath: await chromium.default.executablePath(
                'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
            ),
            headless: true,
        };
    }

    // Local development
    return {
        headless: true,
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Initialize Supabase Admin Client
    // This bypasses RLS policies, allowing public access to specific data requested by this API
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Make sure this is in your .env.local
    );

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).send('Invalid Invoice ID');
    }

    try {
        // --- 2. Fetch Invoice Data (Using Admin Client) ---
        const { data: invoiceData, error: invoiceError } = await supabaseAdmin
            .from('invoices')
            .select('*, client:clients!client_id(*), invoice_line_items(*)')
            .eq('id', id)
            .single();

        if (invoiceError || !invoiceData) {
            console.error("Invoice Error:", invoiceError);
            return res.status(404).send('Invoice not found');
        }

        // --- 3. Fetch Profile Data based on the Invoice Owner ---
        // We get the user_id FROM the invoice we just fetched, not from the request query.
        const { data: profileData, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', invoiceData.user_id) // Assuming your invoice table has a 'user_id' column
            .single();

        if (profileError || !profileData) {
            console.error("Profile Error:", profileError);
            return res.status(404).send('Profile data not found');
        }

        // --- 4. Get the Correct Template Settings ---
        let templateSettings: TemplateSettings;
        const templateId = invoiceData.template_id;

        const foundTemplate = AVAILABLE_TEMPLATES.find(t => t.id === templateId);

        if (foundTemplate) {
            templateSettings = foundTemplate.settings;
        } else {
            templateSettings = AVAILABLE_TEMPLATES[0].settings;
        }

        // --- 5. Combine all data for the template ---
        const fullInvoiceData = {
            ...invoiceData,
            profile: { ...profileData },
            client: invoiceData.client,
            settings: templateSettings,
        };

        // --- 6. Render React component to HTML ---
        const html = renderToStaticMarkup(
            <CurrentTemplate
                templateId={templateId ?? undefined}
                data={fullInvoiceData as any}
            />
        );

        // --- 7. Generate PDF with Playwright ---
        const browserConfig = await getBrowserConfig();
        const browser = await playwright.chromium.launch(browserConfig);

        const page = await browser.newPage();

        // Optimize loading for PDF generation
        await page.setContent(html, { waitUntil: 'networkidle' });
        await page.evaluateHandle('document.fonts.ready');

        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // --- 8. Send the PDF as a response ---
        res.setHeader('Content-Type', 'application/pdf');
        // 'inline' lets the browser preview it, 'attachment' forces download. 
        // Use 'inline' if you want it to open in a new tab first.
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoice_number}.pdf`);

        return res.send(pdf);

    } catch (err: any) {
        console.error("Error generating PDF:", err);
        return res.status(500).send('Error generating PDF');
    }
}