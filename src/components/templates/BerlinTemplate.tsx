/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeCurrency } from '@/lib/normalizeCountry';
import { Client, Profile, } from '@/types';

// The full data structure required by the template
type TemplateData = any & {
    client: Client;
    invoice_line_items: any[];
    profile: Profile & { email?: string; brand_color?: string };
};

type TemplateProps = {
    data: TemplateData;
};

export const BerlinTemplate = ({ data }: TemplateProps) => {
    // Dynamically use the user's brand color, with OrangeRed as the fallback
    const accentColor = data.profile?.brand_color || '#FF4500';

    // Self-contained CSS for perfect PDF rendering
    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400;500&display=swap');
        
        * {
          font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        }
        
        body { 
          font-size: 14px; 
          color: #111827; 
          margin: 0;
          padding: 0;
        }
        .page { 
          max-width: 800px; 
          margin: auto; 
          background: #fff; 
          padding: 40px; 
          border: 1px solid #eee; 
          border-radius: 8px; 
          border-top:0;
          border:1px solid #e5e7eb;
\        }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
        .logo { max-width: 100px; max-height: 50px; object-fit: contain; }
        .header-right { text-align: right; }
        .header-right h1 { 
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; 
          font-size: 60px; 
          font-weight: 700; 
          color: ${accentColor}; 
          margin: 0; 
          line-height: 1; 
        }
        .header-right p { margin: 2px 0 0 0; font-size: 15px; color: #4b5563; }
        .parties { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 50px; }
        .parties h2 { 
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; 
          font-weight: 700; 
          font-size: 12px; 
          text-transform: uppercase; 
          letter-spacing: 1.5px; 
          color: #6b7280; 
          margin: 0 0 10px 0; 
        }
        .parties p { margin: 0; line-height: 1.6; }
        .line-items-table { width: 100%; border-collapse: collapse; }
        .line-items-table thead th { 
          text-align: left; text-transform: uppercase; font-size: 12px; letter-spacing: 1.5px; 
          color: #6b7280; padding: 12px; 
          border-bottom: 3px solid ${accentColor}; 
        }
        .line-items-table tbody td { padding: 15px 12px; border-bottom: 1px solid #e5e7eb; }
        .line-items-table .text-right { text-align: right; }
        .line-items-table .text-center { text-align: center; }
        .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
        .totals-table { width: 100%; max-width: 300px; }
        .totals-table td { padding: 8px 0; }
        .totals-table .label { text-align: left; color: #6b7280; }
        .totals-table .value { text-align: right; font-weight: bold; font-size: 16px; }
        .totals-table .total-amount { font-size: 24px; font-weight: bold; color: ${accentColor}; }
        .footer { margin-top: 60px; border-top: 1px solid #e5e7eb; padding-top: 30px; text-align: center; color: #9ca3af; font-size: 12px; }
        
        .company-name {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
    `;

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
                <div className="page">
                    <header className="header">
                        <div>
                            {data.profile.avatar_url ? (
                                <img src={data.profile.avatar_url} alt="Company Logo" className="logo" />
                            ) : (
                                <h2 className="company-name" style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                    {data.profile.company_name || data.profile.full_name}
                                </h2>
                            )}
                        </div>
                        <div className="header-right">
                            <h1>INVOICE</h1>
                            <p><b>Invoice #:</b> {data.invoice_number}</p>
                            <p><b>Issued:</b> {formatDate(data.issue_date)}</p>
                        </div>
                    </header>

                    <section className="parties">
                        <div className="from">
                            <h2>From</h2>
                            <p><b>{data.profile.company_name || data.profile.full_name}</b></p>
                            <p>{data.profile.address_line_1}</p>
                            <p>{data.profile.city}, {data.profile.country}</p>
                            <p>{data.profile.email}</p>
                        </div>
                        <div className="bill-to">
                            <h2>Bill To</h2>
                            <p><b>{data.client.name}</b></p>
                            <p>{data.client.address_line_1}</p>
                            <p>{data.client.city}, {data.client.country}</p>
                            <p>{data.client.email}</p>
                        </div>
                        <div className="due-date">
                            <h2>Payment Due</h2>
                            <p><b>{formatDate(data.due_date)}</b></p>
                        </div>
                    </section>

                    <section>
                        <table className="line-items-table">
                            <thead><tr><th>Description</th><th className="text-center">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Amount</th></tr></thead>
                            <tbody>
                                {data.invoice_line_items.map((item: any, index: number) => (
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
                        <table className="totals-table">
                            <tbody>
                                <tr><td className="label">Subtotal</td><td className="value">{data.subtotal.toFixed(2)}</td></tr>
                                <tr><td className="label">Tax ({data.tax_rate}%)</td><td className="value">{data.tax_amount.toFixed(2)}</td></tr>
                                <tr className="total-amount"><td className="label">Total</td><td className="value">{currencySymbol}{data.total.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </section>

                    {data.profile.tax_id && (
                        <section style={{ marginTop: '40px', fontSize: '12px', color: '#6b7280' }}>
                            <strong>Tax ID:</strong> {data.profile.tax_id}
                        </section>
                    )}

                    <footer className="footer">
                        <p>{data.notes || 'Thank you for your business!'}</p>
                    </footer>
                </div>
            </body>
        </html>
    );
};