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
        const templateHtml = renderToStaticMarkup(
            <CurrentTemplate
                templateId={templateId ?? undefined}
                data={fullInvoiceData as any}
            />
        );

        // --- 6b. Inject payment block if freelancer has configured payment methods ---
        const { upi_id, paypal_link, stripe_link, custom_payment_link, custom_payment_label } = profileData;
        const hasPaymentMethods = upi_id || paypal_link || stripe_link || custom_payment_link;

        let paymentBlockHtml = '';
        if (hasPaymentMethods) {
            const upiSection = upi_id ? `
                <div style="display:flex;align-items:center;gap:16px;padding:16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;margin-bottom:12px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`upi://pay?pa=${upi_id}`)}&size=100x100&margin=4" width="100" height="100" style="border-radius:6px;border:1px solid #fdba74;background:#fff;flex-shrink:0;" alt="UPI QR" />
                    <div>
                        <p style="margin:0;font-weight:600;color:#111827;">Pay via UPI</p>
                        <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">Scan QR with PhonePe, GPay, Paytm, or any UPI app</p>
                        <p style="margin:6px 0 0 0;font-family:monospace;font-size:13px;color:#c2410c;">${upi_id}</p>
                    </div>
                </div>` : '';

            const paypalSection = paypal_link ? `
                <div style="padding:14px 16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <p style="margin:0;font-weight:600;color:#111827;">Pay via PayPal</p>
                        <p style="margin:2px 0 0 0;font-size:12px;color:#6b7280;">${paypal_link}</p>
                    </div>
                </div>` : '';

            const stripeSection = stripe_link ? `
                <div style="padding:14px 16px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <p style="margin:0;font-weight:600;color:#111827;">Pay via Card / Stripe</p>
                        <p style="margin:2px 0 0 0;font-size:12px;color:#6b7280;">${stripe_link}</p>
                    </div>
                </div>` : '';

            const customSection = custom_payment_link ? `
                <div style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <p style="margin:0;font-weight:600;color:#111827;">${custom_payment_label || 'Pay via Custom Link'}</p>
                        <p style="margin:2px 0 0 0;font-size:12px;color:#6b7280;">${custom_payment_link}</p>
                    </div>
                </div>` : '';

            paymentBlockHtml = `
                <div style="max-width:800px;margin:0 auto;padding:24px 50px 40px 50px;font-family:Arial,sans-serif;">
                    <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 16px 0;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">How to Pay</h3>
                    ${upiSection}${paypalSection}${stripeSection}${customSection}
                </div>`;
        }

        const html = templateHtml.replace('</body>', `${paymentBlockHtml}</body>`);

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