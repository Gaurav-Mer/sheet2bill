/* eslint-disable @typescript-eslint/no-explicit-any */
// components/invoices/templates/ManhattanTemplate.tsx
import { normalizeCountry, normalizeCurrency } from '@/lib/normalizeCountry';
import { Client, Profile } from '@/types';
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

export const ManhattanTemplate = ({ data }: TemplateProps) => {
    const primaryColor = data.profile?.brand_color || '#1A237E';
    const thank_u_note = data.profile?.thank_u_note || "Thank you for your business!";

    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      font-family: 'Inter', 'Helvetica Neue', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Arial', sans-serif;
    }
    
    body { 
      font-size: 14px; 
      color: #212121; 
      background-color: #fff;
      margin: 0;
    }
    .page { max-width: 800px; margin: auto; padding: 50px;border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid ${primaryColor}; padding-bottom: 20px; }
    .logo { max-width: 140px; max-height: 60px; object-fit: contain; }
    .header-right { text-align: right; }
    .header-right h1 { font-family: 'Georgia', serif; font-size: 44px; font-weight: bold; color: ${primaryColor}; margin: 0; }
    .header-right p { margin: 2px 0 0 0; color: #424242; font-size: 15px; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .parties h2 { font-family: 'Georgia', serif; font-size: 16px; letter-spacing: 1px; color: #616161; margin: 0 0 10px 0; }
    .parties p { margin: 0; line-height: 1.7; }
    .line-items-table { width: 100%; border-collapse: collapse; }
    .line-items-table thead th { text-align: left; font-size: 12px; letter-spacing: 1px; color: #fff; background-color: ${primaryColor}; padding: 12px; }
    .line-items-table tbody td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
    .line-items-table .text-right { text-align: right; }
    .line-items-table .text-center { text-align: center; }
    .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
    .totals-table { width: 100%; max-width: 320px; }
    .totals-table td { padding: 12px; }
    .totals-table .label { text-align: left; color: #424242; }
    .totals-table .value { text-align: right; font-weight: bold; }
    .totals-table .total-amount { font-size: 22px; font-weight: bold; color: ${primaryColor}; border-top: 3px solid ${primaryColor}; }
    .footer { margin-top: 50px; border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center; color: #757575; font-size: 12px; }
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
                                <Image height={142} width={142} src={data.profile.avatar_url} alt="Company Logo" className="logo" />
                            ) : (
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: primaryColor, margin: 0, fontFamily: "'Georgia', serif" }}>
                                    {data.profile.company_name || data.profile.full_name}
                                </h2>
                            )}
                        </div>
                        <div className="header-right">
                            <h1 style={{ color: primaryColor }}>INVOICE</h1>
                            <p><b>Invoice #:</b> {data.invoice_number}</p>
                        </div>
                    </header>

                    <section className="parties">
                        <div className="from">
                            <h2>From</h2>
                            <p><b>{data.profile.company_name || data.profile.full_name}</b></p>
                            <p>{data.profile.address_line_1}</p>
                            <p>{data.profile.city}{data.profile.city && data.profile.country && ","} {normalizeCountry(data.profile.country)}</p>
                            <p>{data.profile.email}</p>
                        </div>
                        <div className="bill-to">
                            <h2>Bill To</h2>
                            <p><b>{data.client.name}</b></p>
                            <p>{data.client.address_line_1}</p>
                            <p>{data.client.city}{data.client.city && data.client.country && ","} {normalizeCountry(data.client.country)}</p>
                            <p>{data.client.email}</p>
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

                    {data.notes && <div style={{ marginTop: '50px' }}><h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#616161' }}>Notes</h2><p>{data.notes}</p></div>}

                    <footer className="footer">
                        <p>{thank_u_note}</p>
                    </footer>
                </div>
            </body>
        </html>
    );
};