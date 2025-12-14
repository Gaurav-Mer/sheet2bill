/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeCurrency } from '@/lib/normalizeCountry';
import { hexToLight } from '@/lib/utils';
import { Client, Profile } from '@/types';
import { Logo } from '../Logo';

type TemplateData = any & {
    client: Client;
    invoice_line_items: any[];
    profile: Profile & { email?: string; brand_color?: string };
    // Add these based on our previous discussion
    service_start_date?: string;
    supply_date?: string;
};

type TemplateProps = {
    data: TemplateData;
};

export const BasilTemplate = ({ data }: TemplateProps) => {
    // Default premium black if brand color is missing, or use brand color
    const accentColor = data.profile?.brand_color || '#111827';

    // Format dates cleanly
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Logic to display the Service Date Range or Single Date
    const getServiceDateDisplay = () => {
        if (data.service_start_date && data.supply_date && data.service_start_date !== data.supply_date) {
            return `${formatDate(data.service_start_date)} - ${formatDate(data.supply_date)}`;
        }
        if (data.supply_date) {
            return formatDate(data.supply_date);
        }
        return null;
    };

    const serviceDateString = getServiceDateDisplay();
    const currencySymbol = normalizeCurrency(data.currency)?.currency?.symbol ?? data?.currency;
    const lightColor = hexToLight(accentColor, 0.15);
    // The SVG you provided, encoded for CSS background use
    // I reduced opacity to 0.05 to make it a subtle texture (Premium feel)
    const svgPattern = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill-opacity='0.015'  width='64' height='64' viewBox='0 0 256 256' fill='none'><path d='M 192 0 C 227.346 0 256 28.654 256 64 C 256 99.346 227.346 128 192 128 C 227.346 128 256 156.654 256 192 C 256 227.346 227.346 256 192 256 C 156.654 256 128 227.346 128 192 C 128 227.346 99.346 256 64 256 C 28.654 256 0 227.346 0 192 C 0 156.654 28.654 128 64 128 C 28.654 128 0 99.346 0 64 C 0 28.654 28.654 0 64 0 C 99.346 0 128 28.654 128 64 C 128 28.654 156.654 0 192 0 Z M 64 160 C 46.327 160 32 174.327 32 192 C 32 209.673 46.327 224 64 224 C 81.673 224 96 209.673 96 192 C 96 174.327 81.673 160 64 160 Z M 192 160 C 174.327 160 160 174.327 160 192 C 160 209.673 174.327 224 192 224 C 209.673 224 224 209.673 224 192 C 224 174.327 209.673 160 192 160 Z M 64 32 C 46.327 32 32 46.327 32 64 C 32 81.673 46.327 96 64 96 C 81.673 96 96 81.673 96 64 C 96 46.327 81.673 32 64 32 Z M 192 32 C 174.327 32 160 46.327 160 64 C 160 81.673 174.327 96 192 96 C 209.673 96 224 81.673 224 64 C 224 46.327 209.673 32 192 32 Z' fill='%23000000' ></path></svg>`;


    // --- WATERMARK LOGIC ---
    // Check if user is Pro (Subscription is active)
    const isPro = data.profile?.subscription_ends_at
        ? new Date(data.profile.subscription_ends_at) > new Date()
        : false;
    // Show watermark if NOT Pro, unless manually overridden
    const showWatermark = data.enable_watermark ?? !isPro;

    const css = `
     @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        
        body { 
            margin: 0; padding: 0; 
            font-family: 'Inter', sans-serif; 
            font-size: 13px; 
            color: #1F2937;
            -webkit-print-color-adjust: exact;
        }

        .page {
            max-width: 800px;
            margin: 40px auto;
            background: #fff;
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            border: 1px solid #eee; 
        }

        /* --- HEADER SECTION --- */
        .header-container {
            background-color: ${lightColor};
            /* This uses your SVG as a subtle texture pattern */
            background-image: url("${svgPattern}"); 
            padding: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .brand-section h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 5px 0;
            text-transform: uppercase;
            letter-spacing: -0.5px;
        }

        .brand-section p { margin: 2px 0; color: #6B7280; }
        
        .logo { 
            height: 60px; 
            width: auto; 
            object-fit: contain; 
            margin-bottom: 15px;
            mix-blend-mode: multiply; /* Helps logo blend with texture */
        }

        .invoice-title-block { text-align: right; }
        .invoice-label {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 48px;
            font-weight: 700;
             color: ${accentColor};
            line-height: 0.8;
            margin-bottom: 10px;
        }
        .invoice-details {
            display: inline-block;
            text-align: left;
            margin-top:10px;
        }
        .detail-row { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 6px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { font-weight: 600; color: #9CA3AF; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
        .detail-value { font-weight: 600; color: #111827; font-family: 'Space Grotesk', sans-serif; }

        /* --- ADDRESS GRID --- */
        .address-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding: 40px 50px;
        }
        .address-block h3 {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: ${accentColor};
            margin: 0 0 15px 0;
            font-weight: 700;
            // border-bottom: 2px solid #F3F4F6;
            padding-bottom: 8px;
            display: inline-block;
        }
        .address-block p { margin: 3px 0; line-height: 1.5; }
        .client-name { font-weight: 700; color: #111827; font-size: 15px; margin-bottom: 5px !important;}

        /* --- TABLE --- */
        .table-container { padding: 0 50px; }
        table { width: 100%; border-collapse: collapse; }
        th {
            text-align: left;
            padding: 12px 10px;
            font-size: 11px;
            text-transform: uppercase;
            color: #6B7280;
            font-weight: 600;
            border-bottom: 2px solid #111827;
        }
        td {
            padding: 16px 10px;
            border-bottom: 1px solid #F3F4F6;
            vertical-align: top;
        }
        .col-desc { width: 50%; }
        .col-qty { text-align: center; width: 10%; }
        .col-price { text-align: right; width: 20%; }
        .col-total { text-align: right; width: 20%; font-weight: 600; }
        
        tr:last-child td { border-bottom: none; }

        /* --- TOTALS --- */
        .footer-section {
            padding: 40px 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            page-break-inside: avoid;
        }
        .notes { width: 50%; font-size: 12px; color: #6B7280; line-height: 1.6; padding-right: 20px; }
        .notes h4 { margin: 0 0 5px 0; color: #111827; font-size: 12px; }
        
        .totals-box { width: 40%; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-row:last-child { border-bottom: none; border-top: 2px solid #111827; padding-top: 15px; margin-top: 5px; }
        .total-label { color: #6B7280; }
        .total-value { font-weight: 600; color: #111827; }
        .grand-total { font-size: 20px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: ${accentColor}; }
        .footer { margin-top: 20px; margin-bottom:20px; border-top: 1px solid #e5e7eb; padding-top: 30px; text-align: center; color: #9ca3af; font-size: 12px; }

        /* --- FOOTER --- */
        .doc-footer {
            text-align: center;
            padding: 30px;
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
            font-size: 11px;
            color: #9CA3AF;
            margin-top: 20px;
        }

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

    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </head>
            <body>
                <div className="page">

                    {/* Header with SVG Texture */}
                    <div className="header-container">
                        <div className="brand-section">
                            {data.profile.avatar_url ? (
                                <img src={data.profile.avatar_url} alt="Logo" className="logo" />
                            ) : null}
                            <h1>{data.profile.company_name || data.profile.full_name}</h1>
                            <p>{data.profile.city}, {data.profile.country}</p>
                            <p>{data.profile.email}</p>
                            {data.profile.tax_id && <p>Tax ID: {data.profile.tax_id}</p>}
                        </div>

                        <div className="invoice-title-block">
                            <div className="invoice-label">INVOICE</div>
                            <div className="invoice-details">
                                <div className="detail-row">
                                    <span className="detail-label">Invoice No.</span>
                                    <span className="detail-value">#{data.invoice_number}</span>
                                </div>
                                {data.issue_date && <div className="detail-row">
                                    <span className="detail-label">Issue Date</span>
                                    <span className="detail-value">{formatDate(data.issue_date)}</span>
                                </div>}
                                {data.due_date && <div className="detail-row">
                                    <span className="detail-label">Due Date</span>
                                    <span className="detail-value" style={{ color: '#EF4444' }}>{formatDate(data.due_date)}</span>
                                </div>}
                                {/* Show Service Date if it exists */}
                                {serviceDateString && (
                                    <div className="detail-row">
                                        <span className="detail-label">Service Date</span>
                                        <span className="detail-value">{serviceDateString}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Grid */}
                    <div className="address-grid">
                        <div className="address-block">
                            <h3>Billed To</h3>
                            <p className="client-name">{data.client.name}</p>
                            {data.client.address_line_1 && <p>{data.client.address_line_1}</p>}
                            {data.client.city && <p>{data.client.city}, {data.client.country}</p>}
                            <p>{data.client.email}</p>
                            {data.client.tax_id && <p style={{ marginTop: 5, fontSize: 11, color: '#6B7280' }}>Tax ID: {data.client.tax_id}</p>}
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="col-desc">Description</th>
                                    <th className="col-qty">Qty</th>
                                    <th className="col-price">Price</th>
                                    <th className="col-total">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.invoice_line_items.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{item.description}</div>
                                        </td>
                                        <td className="col-qty">{item.quantity}</td>
                                        <td className="col-price">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                                        <td className="col-total">{currencySymbol}{(item.quantity * item.unit_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Section (Notes + Totals) */}
                    <div className="footer-section">
                        <div className="notes">
                            {data.notes && (
                                <>
                                    <h4>Notes / Payment Terms</h4>
                                    <p>{data.notes}</p>
                                </>
                            )}
                            <div style={{ marginTop: 20 }}>
                                <p>Please include invoice number on your payment.</p>
                            </div>
                        </div>

                        <div className="totals-box">
                            <div className="total-row">
                                <span className="total-label">Subtotal</span>
                                <span className="total-value">{currencySymbol}{data.subtotal.toFixed(2)}</span>
                            </div>
                            {data.tax_amount > 0 && (
                                <div className="total-row">
                                    <span className="total-label">Tax ({data.tax_rate}%)</span>
                                    <span className="total-value">{currencySymbol}{data.tax_amount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="total-row">
                                <span className="total-label" style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Total Due</span>
                                <span className="grand-total">{currencySymbol}{data.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {data.profile.tax_id && (
                        <section style={{ marginTop: '40px', fontSize: '12px', color: '#6b7280' }}>
                            <strong>Tax ID:</strong> {data.profile.tax_id}
                        </section>
                    )}

                    <footer className="footer">
                        <p>{data.notes || 'Thank you for your business!'}</p>

                        {
                            showWatermark && (
                                <a href="https://sheet2bill.com"><div className="watermark">
                                    <Logo className="h-4 w-4" /> <span className='font-semibold'>Sheet2Bill</span>
                                </div>
                                </a>
                            )}
                    </footer>
                </div>
            </body>
        </html>
    );
};