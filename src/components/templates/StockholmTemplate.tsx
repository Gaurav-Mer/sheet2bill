/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeCountry, normalizeCurrency } from '@/lib/normalizeCountry';
import { Client, Profile, } from '@/types';

type TemplateData = any & {
    client: Client;
    invoice_line_items: any[];
    profile: Profile & { email?: string; brand_color?: string };
};

type TemplateProps = {
    data: TemplateData;
};

export const StockholmTemplate = ({ data }: TemplateProps) => {
    // Use the user's brand color, with a fallback
    const primaryColor = data.profile?.brand_color || '#3B82F6'; // Default to a strong blue
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    
    * {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    }
    
    body { 
      font-size: 14px; 
      color: #374151; 
      background-color: #f9fafb; 
      margin: 0;
      padding: 0;
    }
    .page-container {
      display: flex;
      max-width: 900px;
      min-height: 100vh;
      margin: auto;
      background: #fff;
      box-shadow: 0 0 20px rgba(0,0,0,0.05);
    }
    .sidebar {
      width: 250px;
      background-color: ${primaryColor};
      color: #ffffff;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .company_title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 6px;
    }  
    .sidebar-header .logo {max-width: 180px; max-height: 70px; object-fit: contain;  invert(1); border-radius: 4px; }
    .sidebar-header h2 { font-size: 20px; font-weight: bold; margin-top: 10px; }
    .sidebar-footer { font-size: 12px; opacity: 0.7; }
    .sidebar-footer p { margin: 5px 0; }
    .main-content { flex-grow: 1; padding: 50px; }
    .main-header { text-align: right; margin-bottom: 50px; }
    .main-header h1 { font-size: 48px; font-weight: bold; color: #111827; margin: 0; }
    .main-header p { margin: 2px 0 0 0; color: #6b7280; font-size: 15px; }
    .bill-to { margin-bottom: 40px; }
    .bill-to h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin: 0 0 10px 0; }
    .bill-to p { margin: 0; line-height: 1.6; }
    .bill-to b { color: #111827; }
    .line-items-table { width: 100%; border-collapse: collapse; }
    .line-items-table thead th { text-align: left; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #6b7280; padding: 10px; border-bottom: 2px solid #ddd; }
    .line-items-table tbody td { padding: 15px 10px; border-bottom: 1px solid #eee; }
    .line-items-table .text-right { text-align: right; }
    .line-items-table .text-center { text-align: center; }
    .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
    .totals-table { width: 100%; max-width: 300px; }
    .totals-table td { padding: 10px; }
    .totals-table .label { text-align: left; color: #555; }
    .totals-table .value { text-align: right; font-weight: bold; color: #000; }
    .totals-table .total-amount { font-size: 22px; font-weight: bold; color: ${primaryColor}; }
  `;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const currencySymbol = normalizeCurrency(data.currency)?.currency?.symbol ?? data?.currency;

    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </head>
            <body>
                <div className="page-container">
                    {/* --- Sidebar --- */}
                    <aside className="sidebar">
                        <div className="sidebar-header">
                            <p className='company_title'>{data.profile?.company_name}</p>
                            {data.profile.avatar_url ? (
                                <img src={data.profile.avatar_url} alt="Company Logo" className="logo" />
                            ) : (
                                <h2 style={{ color: '#fff' }}>
                                    {data.profile.company_name || data.profile.full_name}
                                </h2>
                            )}
                            <div style={{ marginTop: '30px', opacity: 0.8 }}>
                                <p>{data.profile.address_line_1}</p>
                                <p>{data.profile.city}{data.profile.country && data.profile.city && ","} {normalizeCountry(data.profile.country)}</p>
                                <p>{data.profile.email}</p>
                            </div>
                        </div>
                        <footer className="sidebar-footer">
                            <p>Thank you for your business!</p>
                            {data.profile.tax_id && <p>Tax ID: {data.profile.tax_id}</p>}
                        </footer>
                    </aside>

                    {/* --- Main Content --- */}
                    <main className="main-content">
                        <header className="main-header">
                            <h1>Invoice</h1>
                            <p><b>Invoice #:</b> {data.invoice_number}</p>
                            <p><b>Issued:</b> {formatDate(data.issue_date)}</p>
                            <p><b>Due:</b> {formatDate(data.due_date)}</p>
                        </header>

                        <section className="bill-to">
                            <h2>Bill To</h2>
                            <p><b>{data.client.name}</b></p>
                            <p>{data.client.address_line_1}</p>
                            <p>{data.client.city}, {data.client.country}</p>
                            <p>{data.client.email}</p>
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

                        {data.notes && <div style={{ marginTop: '50px' }}><h2 style={{ fontSize: '12px', textTransform: 'uppercase' }}>Notes</h2><p>{data.notes}</p></div>}
                    </main>
                </div>
            </body>
        </html>
    );
};