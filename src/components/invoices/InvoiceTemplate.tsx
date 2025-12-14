/* eslint-disable @typescript-eslint/no-explicit-any */
// components/invoices/InvoiceTemplate.tsx

import { normalizeCountry, normalizeCurrency } from "@/lib/normalizeCountry";
import { Client, Profile } from "@/types";
import { Logo } from "../Logo";

// The full data structure required by the template
type InvoiceTemplateData = any & {
    client: Client;
    invoice_line_items: any[];
    profile: Profile & { email?: string };
    enable_watermark?: boolean; // Optional override

};

type InvoiceTemplateProps = {
    data: InvoiceTemplateData;
};

// This is a pure, stateless component. Date formatting is handled by the parent.
const InvoiceTemplate = ({ data }: InvoiceTemplateProps) => {
    // A professional color scheme for the PDF.
    const primaryColor = 'black'; // Indigo
    const thanksMessage = data.profile?.thank_u_note || "Thank you for your business!";


    // --- WATERMARK LOGIC ---
    // Check if user is Pro (Subscription is active)
    const isPro = data.profile?.subscription_ends_at
        ? new Date(data.profile.subscription_ends_at) > new Date()
        : false;
    // Show watermark if NOT Pro, unless manually overridden
    const showWatermark = data.enable_watermark ?? !isPro;

    // Self-contained CSS for perfect PDF rendering
    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        }
        
        body { 
            -webkit-font-smoothing: antialiased; 
            font-size: 14px; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #fff; 
        }
        .invoice-container { max-width: 800px; margin: auto; padding: 40px; border:1px solid #e5e7eb; border-radius: 8px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .logo { max-width: 150px; max-height: 70px; object-fit: contain; }
        .invoice-details { text-align: right; }
        .invoice-details h1 { font-size: 36px; font-weight: bold; color: ${primaryColor}; margin: 0 0 10px 0; }
        .invoice-details p { margin: 0; line-height: 1.6; }
        .company-info { margin-bottom: 40px; display: flex; justify-content: space-between; }
        .bill-to p, .from p { margin: 0; line-height: 1.6; }
        .line-items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .line-items-table thead th { text-align: left; color: #6b7280; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .line-items-table tbody td { border-bottom: 1px solid #e5e7eb; padding: 12px 0; }
        .line-items-table .text-right { text-align: right; }
        .line-items-table .text-center { text-align: center; }
        .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
        .totals table { width: 100%; max-width: 300px; }
        .totals td { padding: 8px 0; text-align: right; }
        .totals td:first-child { text-align: left; color: #6b7280; }
        .totals .total-amount td { font-size: 18px; font-weight: bold; color: #111827; border-top: 1px solid #374151; }
        .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px; }
        .watermark {
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: black;
            display:flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }
            `;

    // Helper to format dates consistently for the PDF
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const currencySymbol = normalizeCurrency(data.currency)?.currency?.symbol ?? data?.currency;


    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </head>
            <body>
                <div className="invoice-container">
                    <header className="header">
                        <div>
                            {data.profile.avatar_url ? (
                                <img src={data.profile.avatar_url} alt="Company Logo" className="logo" />
                            ) : (
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: primaryColor, margin: 0 }}>
                                    {data.profile.company_name || data.profile.full_name}
                                </h2>
                            )}
                        </div>
                        <div className="invoice-details">
                            <h1>Invoice</h1>
                            <p><b>Invoice #:</b> {data.invoice_number}</p>
                            <p><b>Issued:</b> {formatDate(data.issue_date)}</p>
                            <p><b>Due:</b> {formatDate(data.due_date)}</p>
                        </div>
                    </header>

                    <section className="company-info">
                        <div className="from">
                            <p style={{ color: '#6b7280', fontWeight: 'bold' }}>FROM</p>
                            <p><b>{data.profile.company_name || data.profile.full_name}</b></p>
                            <p>{data.profile.address_line_1}</p>
                            <p>{data.profile.city}{data.profile.country && data.profile.city && ","} {normalizeCountry(data.profile.country)}</p>
                            <p>{data.profile.email}</p>
                        </div>
                        <div className="bill-to" style={{ textAlign: 'right' }}>
                            <p style={{ color: '#6b7280', fontWeight: 'bold' }}>BILL TO</p>
                            <p><b>{data.client.name}</b></p>
                            <p>{data.client.address_line_1}</p>
                            <p>{data.client.city}{data.client.country && data.client.city && ","} {normalizeCountry(data.client.country)}</p>
                            <p>{data.client.email}</p>
                        </div>
                    </section>

                    <section>
                        <table className="line-items-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-right">Unit Price</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.invoice_line_items?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{item.description}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                                        <td className="text-right">{currencySymbol}{(item.quantity * item.unit_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="totals">
                        <table>
                            <tbody>
                                <tr><td>Subtotal</td><td>{currencySymbol}{data.subtotal.toFixed(2)}</td></tr>
                                <tr><td>Tax ({data.tax_rate}%)</td><td>{currencySymbol}{data.tax_amount.toFixed(2)}</td></tr>
                                <tr className="total-amount"><td>Total</td><td>{currencySymbol}{data.total.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </section>

                    {(data.profile.tax_id || data.notes) && (
                        <section style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                            {data.notes && <div><strong>Notes:</strong><p>{data.notes}</p></div>}
                            {data.profile.tax_id && <div style={{ marginTop: '10px' }}><strong>Tax ID:</strong><p>{data.profile.tax_id}</p></div>}
                        </section>
                    )}

                    <footer className="footer">
                        <p>{thanksMessage}</p>
                        <p>{data.profile.company_name || 'Sheet2bill'}</p>

                        {
                            showWatermark && (
                                <a href="https://sheet2bill.com"><div className="watermark">
                                    <Logo className="h-4 w-4" /> <span className='font-semibold'>Sheet2Bill</span>
                                </div></a>
                            )}
                    </footer>
                </div>
            </body>
        </html>
    );
};

export default InvoiceTemplate;