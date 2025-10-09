/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Profile } from '@/types';

type TemplateData = any & {
    client: Client;
    invoice_line_items: any[];
    profile: Profile & { email?: string };
};

type TemplateProps = {
    data: TemplateData;
};

export const KyotoTemplate = ({ data }: TemplateProps) => {
    const accentColor = data?.profile?.brand_color ?? '#00000'; // Deep, sophisticated blue
    const thanksMessage = data.profile?.thank_u_note || "Thank you for your business!";
    const css = `
    body { 
      font-family: 'Montserrat', sans-serif; 
      font-size: 14px; 
      color: #333; 
      margin: 0;
    }
    .page { 
      max-width: 800px; 
      margin: auto; 
      background: #fff; 
      padding: 50px; 
      border: 1px solid #eee; 
      border-radius: 8px; 
      border-top:0
    }
    .header { 
      background-color: ${accentColor};
      color: #fff;
      padding: 30px;
      margin: -50px -50px 40px -50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo { max-width: 140px; max-height: 60px; object-fit: contain;  invert(1); }
    .header-right { text-align: right; }
    .header-right h1 { 
      font-family: 'Playfair Display', serif; 
      font-size: 48px; 
      font-weight: 700; 
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .parties { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 50px; }
    .parties h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin: 0 0 10px 0; }
    .parties p { margin: 0; line-height: 1.6; }
    .parties b { color: #000; }
    .line-items-table { width: 100%; border-collapse: collapse; }
    .line-items-table thead th { 
      text-align: left; 
      text-transform: uppercase; 
      font-size: 12px; 
      letter-spacing: 1px; 
      color: #888; 
      padding: 10px 0; 
      border-bottom: 2px solid ${accentColor}; 

    }
    .line-items-table tbody td { padding: 15px 0; border-bottom: 1px solid #eee; }
    .line-items-table .text-right { text-align: right; }
    .line-items-table .text-center { text-align: center; }
    .totals { margin-top: 30px; display: flex; justify-content: flex-end; }
    .totals-table { width: 100%; max-width: 300px; }
    .totals-table td { padding: 10px; }
    .totals-table .label { text-align: left; color: #555; }
    .totals-table .value { text-align: right; font-weight: bold; color: #000; }
    .totals-table .total-amount { font-size: 22px; font-weight: bold; color: ${accentColor}; }
    .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #aaa; font-size: 12px; }
  `;

    const formatDate = (dateString: string | null) => { /* ... date formatting ... */ };

    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                {/* <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" /> */}
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </head>
            <body>
                <div className="page">
                    <header className="header">
                        <div>
                            {data.profile.avatar_url ? (
                                <img src={data.profile.avatar_url} alt="Company Logo" className="logo" />
                            ) : (
                                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                                    {data.profile.company_name || data.profile.full_name}
                                </h2>
                            )}
                        </div>
                        <div className="header-right"><h1>INVOICE</h1></div>
                    </header>

                    <section className="parties">
                        <div className="from">
                            <h2>From</h2>
                            <p><b>{data.profile.company_name || data.profile.full_name}</b></p>
                            <p>{data.profile.address_line_1}</p>
                            <p>{data.profile.city}{data.profile.city && data.profile.country && ","} {data.profile.country}</p>
                        </div>
                        <div className="bill-to">
                            <h2>Bill To</h2>
                            <p><b>{data.client.name}</b></p>
                            <p>{data.client.address_line_1}</p>
                            <p>{data.client.city}{data.client.city && data.client.city && ","} {data.client.country}</p>
                        </div>
                        <div className="invoice-info">
                            <h2>Details</h2>
                            <p><b>Invoice #:</b> {data.invoice_number}</p>
                            <p><b>Issued:</b> {formatDate(data.issue_date) ?? ""}</p>
                            <p><b>Due:</b> {formatDate(data.due_date) ?? ""}</p>
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
                                <tr className="total-amount"><td className="label">Total</td><td className="value">{data.currency} {data.total.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </section>

                    <footer className="footer">
                        <p>{thanksMessage}</p>
                    </footer>
                </div>
            </body>
        </html>
    );
};