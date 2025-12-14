/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeCountry, normalizeCurrency } from '@/lib/normalizeCountry';
import { Client, Profile, } from '@/types';
import { Logo } from '../Logo';


type TemplateData = any & {
    client: Client;
    invoice_line_items: any[];
    profile: Profile & { email?: string; brand_color?: string };
};

type TemplateProps = {
    data: TemplateData;
};

export const JaipurTemplate = ({ data }: TemplateProps) => {
    const accentColor = data.profile?.brand_color || '#D95B43'; // Terracotta/Rust

    // --- WATERMARK LOGIC ---
    // Check if user is Pro (Subscription is active)
    const isPro = data.profile?.subscription_ends_at
        ? new Date(data.profile.subscription_ends_at) > new Date()
        : false;
    // Show watermark if NOT Pro, unless manually overridden
    const showWatermark = data.enable_watermark ?? !isPro;

    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    
    * {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    }
    body { 
      font-size: 14px; 
      color: #4A3C31; /* Dark Brown */
      margin: 0;
    }
    .page { max-width: 800px; margin: 40px auto; padding: 40px; background: #fff; border:1px solid #e5e7eb; border-radius: 8px;}
    .header { text-align: center; margin-bottom: 40px; display: flex; flex-direction: column; align-items: center; }
    .logo { max-width: 120px; max-height: 60px; object-fit: contain; margin-bottom: 15px; border-radius:4px}
    .header h1 { 
       font-family: 'Montserrat', sans-serif; 
      font-size: 40px; 
      font-weight: 700; 
      color: #333; 
      margin: 0 0 10px 0;
    }
    .header p { margin: 2px 0 0 0; color: #6b7280; font-size: 15px; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 50px; }
    .parties h2 { font-family: 'Montserrat', sans-serif; 
; font-size: 18px; color: ${accentColor}; margin: 0 0 10px 0; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    .parties p { margin: 0; line-height: 1.7; }
    .line-items-table { width: 100%; border-collapse: collapse; }
    .line-items-table thead th { 
      text-align: left; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; 
      color: ${accentColor}; 
      padding: 10px; border-bottom: 2px solid ${accentColor}; 
    }
    .line-items-table tbody td { padding: 15px 10px; border-bottom: 1px solid #f3f3f3; }
    .line-items-table .text-right { text-align: right; }
    .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
    .totals-table { width: 100%; max-width: 300px; }
    .totals-table td { padding: 10px; }
    .totals-table .label { text-align: left; color: #555; }
    .totals-table .value { text-align: right; font-weight: bold; color: #000; }
    .totals-table .total-amount { font-size: 22px; font-weight: bold; color: ${accentColor}; }
    .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #aaa; font-size: 12px; }
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
                <div className="page">
                    <header className="header">
                        {data.profile.avatar_url && (
                            <img src={data.profile.avatar_url} alt="Company Logo" className="logo" />
                        )}
                        <h1>{data.profile.company_name || data.profile.full_name}</h1>
                        <p>Invoice #: {data.invoice_number}</p>
                    </header>

                    <section className="parties">
                        <div className="from">
                            <h2>From</h2>
                            <p><b>{data.profile.company_name || data.profile.full_name}</b></p>
                            <p>{data.profile.address_line_1}</p>
                            <p>{data.profile.city}{data.client.city && data.client.country && ","} {normalizeCountry(data.profile.country)}</p>
                            <p>{data.profile.email}</p>
                        </div>
                        <div className="bill-to">
                            <h2>Bill To</h2>
                            <p><b>{data.client.name}</b></p>
                            <p>{data.client.address_line_1}</p>
                            <p>{data.client.city}{data.client.city && data.client.country && ","} {normalizeCountry(data.client.country)}</p>
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


                    <footer className="footer">
                        <p>{data.notes || 'Thank you for your business!'}</p>
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