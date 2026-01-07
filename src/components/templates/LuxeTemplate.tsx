/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeCurrency } from '@/lib/normalizeCountry';
import React from 'react';
import { Logo } from '../Logo';

type TemplateData = any & {
  client: any;
  invoice_line_items: any[];
  profile: any;
};

type TemplateProps = {
  data: TemplateData;
};

export default function LuxeTemplate({ data }: TemplateProps) {
  const accentColor = data?.profile?.brand_color || '#0ea5e9';

  const isPro = data?.profile?.subscription_ends_at
    ? new Date(data.profile.subscription_ends_at) > new Date()
    : false;
  const showWatermark = data?.enable_watermark ?? !isPro;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
    
    * {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      box-sizing: border-box;
    }
    
    body { 
      font-size: 14px; 
      margin: 0;
      padding: 0;
    }
    
    .page { 
      max-width: 900px; 
      margin:  auto; 
      background: #ffffff;
      position: relative;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    
    .decorative-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
    }
    
    .header-section {
      padding: 60px 70px 50px;
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
      border-bottom: 1px solid #e2e8f0;
      position: relative;
    }
    
    .header-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 60px;
      align-items: start;
    }
    
    .brand-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .logo {
      max-width: 140px;
      max-height: 70px;
      object-fit: contain;
    }
    
    .company-name-display {
      font-family: 'Lora', serif;
      font-size: 32px;
      font-weight: 700;
      color: ${accentColor};
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .company-details {
      margin-top: 8px;
      color: #64748b;
      line-height: 1.8;
      font-size: 13px;
      font-weight: 400;
    }
    
    .invoice-header-box {
      background: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%);
      padding: 32px 36px;
      border-radius: 12px;
      min-width: 280px;
    }
    
    .invoice-header-box h1 {
      font-family: 'Lora', serif;
      font-size: 36px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 20px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .invoice-details-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .invoice-detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .invoice-detail-row:last-child {
      border-bottom: none;
    }
    
    .invoice-detail-label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 12px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .invoice-detail-value {
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
    }
    
    .parties-section {
      padding: 50px 70px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }
    
    .party-card {
      background: #ffffff;
      border: 2px solid #f1f5f9;
      border-radius: 10px;
      padding: 28px;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .party-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: ${accentColor};
      border-radius: 10px 0 0 10px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .party-card:hover::before {
      opacity: 1;
    }
    
    .party-card:hover {
      border-color: ${accentColor}40;
      transform: translateY(-2px);
    }
    
    .party-card h3 {
      font-family: 'Lora', serif;
      font-size: 13px;
      font-weight: 600;
      color: ${accentColor};
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .party-card .party-name {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }
    
    .party-card p {
      margin: 0 0 4px 0;
      color: #475569;
      font-size: 13px;
      line-height: 1.6;
    }
    
    .due-date-card {
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
      border: 2px solid ${accentColor};
    }
    
    .due-date-card::before {
      opacity: 1;
    }
    
    .due-date-amount {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid ${accentColor}30;
    }
    
    .due-date-amount-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 6px;
    }
    
    .due-date-amount-value {
      font-family: 'Lora', serif;
      font-size: 32px;
      font-weight: 700;
      color: ${accentColor};
      line-height: 1;
    }
    
    .items-section {
      padding: 0 70px 50px;
    }
    
    .items-table-wrapper {
      border: 2px solid #f1f5f9;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .items-table thead {
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
    }
    
    .items-table thead th {
      text-align: left;
      padding: 20px 24px;
      font-family: 'Lora', serif;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-bottom: 2px solid ${accentColor};
    }
    
    .items-table tbody td {
      padding: 22px 24px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 14px;
    }
    
    .items-table tbody tr:last-child td {
      border-bottom: none;
    }
    
    .items-table tbody tr {
      transition: background 0.2s ease;
    }
    
    .items-table tbody tr:hover {
      background: #fafbfc;
    }
    
    .items-table .desc-col {
      font-weight: 500;
      color: #0f172a;
    }
    
    .items-table .text-center {
      text-align: center;
    }
    
    .items-table .text-right {
      text-align: right;
      font-weight: 500;
    }
    
    .items-table .amount-col {
      color: ${accentColor};
      font-weight: 600;
    }
    
    .summary-section {
      padding: 0 70px 60px;
      display: flex;
      justify-content: flex-end;
    }
    
    .summary-box {
      width: 100%;
      max-width: 420px;
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 32px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
    }
    
    .summary-row-label {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }
    
    .summary-row-value {
      font-size: 16px;
      color: #1e293b;
      font-weight: 600;
    }
    
    .summary-divider {
      height: 1px;
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
      margin: 12px 0;
    }
    
    .summary-total {
      margin-top: 16px;
      padding-top: 20px;
      border-top: 3px solid ${accentColor};
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .summary-total-label {
      font-family: 'Lora', serif;
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .summary-total-value {
      font-family: 'Lora', serif;
      font-size: 36px;
      font-weight: 700;
      color: ${accentColor};
      line-height: 1;
    }
    
    .notes-section {
      padding: 0 70px 50px;
    }
    
    .notes-box {
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
      border-left: 4px solid ${accentColor};
      border-radius: 6px;
      padding: 24px 28px;
    }
    
    .notes-title {
      font-family: 'Lora', serif;
      font-size: 13px;
      font-weight: 600;
      color: ${accentColor};
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .notes-text {
      color: #475569;
      font-size: 14px;
      line-height: 1.7;
      margin: 0;
    }
    
    .tax-section {
      padding: 0 70px 30px;
      font-size: 12px;
      color: #64748b;
    }
    
    .tax-section strong {
      color: #334155;
      font-weight: 600;
    }
    
    .footer-section {
      padding: 40px 70px;
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }
    
    .watermark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.3s ease;
      padding: 8px 16px;
      border-radius: 6px;
    }
    
    .watermark:hover {
      color: ${accentColor};
      background: ${accentColor}10;
    }
    
    .watermark svg {
      width: 16px;
      height: 16px;
    }
  `;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const currencySymbol = normalizeCurrency(data?.currency || 'USD')?.currency?.symbol ?? '$';


  const finalData = data;

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="page">
          <div className="decorative-border"></div>

          <div className="header-section">
            <div className="header-grid">
              <div className="brand-section">
                {finalData.profile.avatar_url ? (
                  <img src={finalData.profile.avatar_url} alt="Logo" className="logo" />
                ) : (
                  null
                )}

                {
                  finalData.profile.company_name || finalData.profile.full_name ? <h2 className="company-name-display">
                    {finalData.profile.company_name || finalData.profile.full_name}
                  </h2> : null
                }
                <div className="company-details">
                  <div>{finalData.profile.address_line_1}</div>
                  <div>{finalData.profile.city}, {finalData.profile.country}</div>
                  <div>{finalData.profile.email}</div>
                </div>
              </div>

              <div className="invoice-header-box">
                <h1>Invoice</h1>
                <div className="invoice-details-list">
                  <div className="invoice-detail-row">
                    <span className="invoice-detail-label">Number</span>
                    <span className="invoice-detail-value">{finalData.invoice_number}</span>
                  </div>
                  <div className="invoice-detail-row">
                    <span className="invoice-detail-label">Issued</span>
                    <span className="invoice-detail-value">{formatDate(finalData.issue_date)}</span>
                  </div>
                  {finalData.due_date && (
                    <div className="invoice-detail-row">
                      <span className="invoice-detail-label">Due Date</span>
                      <span className="invoice-detail-value">{formatDate(finalData.due_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="parties-section">
            <div className="party-card">
              <h3>Bill To</h3>
              <div className="party-name">{finalData.client.name}</div>
              <p>{finalData.client.address_line_1}</p>
              <p>{finalData.client.city}, {finalData.client.country}</p>
              <p>{finalData.client.email}</p>
            </div>

            {finalData.due_date && (
              <div className="party-card due-date-card">
                <h3>Payment Due</h3>
                <div className="party-name">{formatDate(finalData.due_date)}</div>
                <div className="due-date-amount">
                  <div className="due-date-amount-label">Total Amount Due</div>
                  <div className="due-date-amount-value">{currencySymbol}{finalData.total.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="items-section">
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {finalData.invoice_line_items.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="desc-col">{item.description}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                      <td className="text-right amount-col">{currencySymbol}{(item.quantity * item.unit_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-box">
              <div className="summary-row">
                <span className="summary-row-label">Subtotal</span>
                <span className="summary-row-value">{currencySymbol}{finalData.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row">
                <span className="summary-row-label">Tax ({finalData.tax_rate}%)</span>
                <span className="summary-row-value">{currencySymbol}{finalData.tax_amount.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span className="summary-total-label">Total</span>
                <span className="summary-total-value">{currencySymbol}{finalData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {finalData.profile.tax_id && (
            <div className="tax-section">
              <strong>Tax ID:</strong> {finalData.profile.tax_id}
            </div>
          )}

          {finalData.notes && (
            <div className="notes-section">
              <div className="notes-box">
                <div className="notes-title">Notes</div>
                <p className="notes-text">{finalData.notes}</p>
              </div>
            </div>
          )}

          {showWatermark && (
            <div className="footer-section">
              <a href="https://sheet2bill.com" className="watermark">
                <Logo />
                <span style={{ fontWeight: 600 }}>Powered by Sheet2Bill</span>
              </a>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}