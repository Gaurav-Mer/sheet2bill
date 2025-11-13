/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeCountry, normalizeCurrency } from '@/lib/normalizeCountry';
import { Client, Profile, } from '@/types';
import Head from 'next/head';
import Image from 'next/image';

type TemplateData = any & {
    client: Client;
    invoice_line_items: any[];
    profile: Profile & { email?: string };
};

type TemplateProps = {
    data: TemplateData;
};

export const ZurichTemplate = ({ data }: TemplateProps) => {
    const primaryColor = data.profile?.brand_color || 'hsl(243, 75%, 59%)';
    const thanksMessage = data.profile?.thank_u_note || "Thank you for your business!";
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    }
    
    body { 
      -webkit-font-smoothing: antialiased; 
      font-size: 14px; 
      color: #374151; /* Gray-700 */
      background-color: #fff; 
      margin: 0;
    }
    .page { max-width: 800px; margin: auto; padding: 50px; border: 1px solid #e5e7eb; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }
    .logo { max-width: 120px; max-height: 50px; object-fit: contain; }
    .header-right { text-align: right; }
    .header-right h1 { font-size: 32px; font-weight: bold; color: ${primaryColor}; margin: 0; }
    .header-right p { margin: 2px 0 0 0; color: #6b7280; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 50px; }
    .parties h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin: 0 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .parties p { margin: 0; line-height: 1.7; }
    .line-items-table { width: 100%; border-collapse: collapse; }
    .line-items-table thead th { text-align: left; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #6b7280; padding: 10px; border-bottom: 2px solid ${primaryColor}; }
    .line-items-table tbody td { padding: 15px 10px; border-bottom: 1px solid #e5e7eb; }
    .line-items-table .text-right { text-align: right; }
    .line-items-table .text-center { text-align: center; }
    .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
    .totals-table { width: 100%; max-width: 350px; }
    .totals-table td { padding: 10px 0; }
    .totals-table .label { text-align: left; color: #6b7280; }
    .totals-table .value { text-align: right; }
    .totals-table .total-amount { font-size: 20px; font-weight: bold; color: ${primaryColor}; border-top: 2px solid #111827; }
    .footer { margin-top: 50px; border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px; }
  `;

    const currencySymbol = normalizeCurrency(data.currency)?.currency?.symbol ?? data?.currency;
    return (
        <html>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </Head>
            <body>
                <div className="page">
                    <header className="header">
                        <div>
                            {data.profile.avatar_url ? (
                                <Image width={142} height={142} src={data.profile.avatar_url} alt="Company Logo" className="logo" />
                            ) : (
                                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: primaryColor, margin: 0 }}>
                                    {data.profile.company_name || data.profile.full_name}
                                </h2>
                            )}
                        </div>
                        <div className="header-right">
                            <h1>Invoice</h1>
                            <p>{data.invoice_number}</p>
                        </div>
                    </header>

                    <section className="parties">
                        <div className="from">
                            <h2>From</h2>
                            <p><b>{data.profile.company_name || data.profile.full_name}</b></p>
                            <p>{data.profile.address_line_1}</p>
                            <p>{data.profile.city}{data.profile.city && data?.profile?.country && ","} {normalizeCountry(data.profile.country)}</p>
                            <p>{data.profile.email}</p>
                        </div>
                        <div className="bill-to">
                            <h2>Bill To</h2>
                            <p><b>{data.client?.name}</b></p>
                            <p>{data.client.address_line_1}</p>
                            <p>{data.client.city}{data?.client?.city && data?.client?.country && ","} {normalizeCountry(data.client.country)}</p>
                            <p>{data.client.email}</p>
                        </div>
                    </section>

                    <section>
                        <table className="line-items-table">
                            <thead><tr><th>Description</th><th className="text-center">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Amount</th></tr></thead>
                            <tbody>
                                {data.invoice_line_items?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{item.description}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right">{item.unit_price.toFixed(2)}</td>
                                        <td className="text-right">{(item.quantity * item.unit_price).toFixed(2)}</td>
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

                    {data.notes && <div style={{ marginTop: '50px' }}><h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280' }}>Notes</h2><p>{data.notes}</p></div>}

                    <footer className="footer">
                        <p>{thanksMessage}</p>
                    </footer>
                </div>
            </body>
        </html>
    );
};