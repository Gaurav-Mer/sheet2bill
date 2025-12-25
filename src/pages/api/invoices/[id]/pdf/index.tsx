/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/invoices/[id]/pdf.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
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
    const supabase = createPagesServerClient({ req, res });
    const { userId } = req.query ?? {};

    const { id } = req.query;

    try {
        // --- 1. Fetch all necessary data ---
        const [invoiceQuery, profileQuery] = await Promise.all([
            supabase.from('invoices').select('*, client:clients!client_id(*), invoice_line_items(*)').eq('id', id).single(),
            supabase.from('profiles').select('*').eq('id', userId).single()
        ]);

        const { data: invoiceData, error: invoiceError } = invoiceQuery;
        const { data: profileData, error: profileError } = profileQuery;

        if (invoiceError || profileError || !invoiceData || !profileData) {
            return res.status(404).send('Invoice or profile not found');
        }

        // --- 2. Get the Correct Template Settings ---
        let templateSettings: TemplateSettings
        const templateId = invoiceData.template_id; // e.g., 'zurich'

        // For now, we only have pre-defined templates.
        // In the future, you would add an 'else' block here to fetch custom templates from the database.
        const foundTemplate = AVAILABLE_TEMPLATES.find(t => t.id === templateId);

        if (foundTemplate) {
            templateSettings = foundTemplate.settings;
        } else {
            // Default to the first pre-defined template if none is found
            templateSettings = AVAILABLE_TEMPLATES[0].settings;
        }

        // --- 3. Combine all data for the template ---
        const fullInvoiceData = {
            ...invoiceData,
            profile: { ...profileData, },
            client: invoiceData.client,
            settings: templateSettings, // Pass the settings to the template
        };

        // --- 4. Render React component to HTML ---
        const html = renderToStaticMarkup(<CurrentTemplate templateId={templateId ?? undefined} data={fullInvoiceData as any} />);

        // --- 5. Generate PDF with Playwright ---
        // const executablePath = await chromium.executablePath;
        // const browser = await playwright.chromium.launch({
        //     args: chromium.args,
        //     executablePath: executablePath || undefined,
        //     headless: chromium.headless,
        // });

        // const browser = await playwright.chromium.launch({
        //     headless: true,
        //     executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        // });

        // const page = await browser.newPage();
        // await page.setContent(html, { waitUntil: 'networkidle' });
        // const pdf = await page.pdf({ format: 'A4', printBackground: true });
        // await browser.close();

        const browserConfig = await getBrowserConfig();
        const browser = await playwright.chromium.launch(browserConfig);

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle' });
        await page.evaluateHandle('document.fonts.ready');
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // --- 6. Send the PDF as a response ---
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoice_number}.pdf`);
        return res.send(pdf);

    } catch (err: any) {
        console.error("Error generating PDF:", err);
        return res.status(500).send('Error generating PDF');
    }
}