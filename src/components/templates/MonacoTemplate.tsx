/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Logo } from '../Logo';
import { normalizeCurrency } from '@/lib/normalizeCountry';


// Mock Logo component

type TemplateData = any & {
    client: any;
    invoice_line_items: any[];
    profile: any;
};

type TemplateProps = {
    data: TemplateData;
};

export default function MonacoTemplate({ data }: TemplateProps) {
    const accentColor = data?.profile?.brand_color || '#6366f1';

    const isPro = data?.profile?.subscription_ends_at
        ? new Date(data.profile.subscription_ends_at) > new Date()
        : false;
    const showWatermark = data?.enable_watermark ?? !isPro;

    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
    
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      box-sizing: border-box;
    }
    
    body { 
      font-size: 14px; 
      color: #1e293b; 
      margin: 0;
      padding: 0;
      background: #f8fafc;
    }
    
    .page { 
      max-width: 850px; 
      margin: 40px auto; 
      background: #ffffff;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .header-banner {
      background: linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%);
      padding: 50px 60px 40px;
      position: relative;
      overflow: hidden;
    }
    
    .header-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
    
    .header-banner::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -5%;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      color: #ffffff;
    }
    
    .logo-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .logo {
      max-width: 120px;
      max-height: 60px;
      object-fit: contain;
    }
    
    .company-name-header {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .invoice-title {
      text-align: right;
    }
    
    .invoice-title h1 {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 8px 0;
      line-height: 1;
      color: #ffffff;
      letter-spacing: -1px;
    }
    
    .invoice-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      opacity: 0.95;
    }
    
    .invoice-meta-item {
      font-size: 14px;
      font-weight: 300;
    }
    
    .invoice-meta-item strong {
      font-weight: 500;
      margin-right: 6px;
    }
    
    .content-section {
      padding: 30px 30px;
    }
    
    .info-cards {
      display: grid;
      grid-template-columns: ${data.due_date ? '1fr 1fr 1fr' : '1fr 1fr'};
      gap: 24px;
      margin-bottom: 50px;
    }
.info-card {
  background: color-mix(in srgb, ${accentColor} 5%, transparent);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.3s ease;
}
    
    .info-card:hover {
      border-color: ${accentColor};
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
    }
    
    .info-card h3 {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: ${accentColor};
      margin: 0 0 12px 0;
    }
    
    .info-card p {
      margin: 0 0 4px 0;
      line-height: 1.6;
      color: #475569;
      font-size: 13px;
    }
    
    .info-card .name {
      font-weight: 600;
      color: #1e293b;
      font-size: 15px;
      margin-bottom: 8px;
    }
    
    .payment-due-highlight {
      background: linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%);
      border: 2px solid ${accentColor};
    }
    
    .payment-due-highlight .due-amount {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: ${accentColor};
      margin-top: 8px;
    }
    
    .line-items-wrapper {
      margin-bottom: 40px;
    }
    
    .line-items-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .line-items-table thead {
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
    }
    
    .line-items-table thead th {
      text-align: left;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.2px;
      color: #64748b;
      padding: 16px 20px;
      border-bottom: 2px solid ${accentColor};
    }
    
    .line-items-table tbody td {
      padding: 18px 20px;
      border-bottom: 1px solid #f1f5f9;
      color: #475569;
    }
    
    .line-items-table tbody tr:last-child td {
      border-bottom: none;
    }
    
    .line-items-table tbody tr:hover {
      background: color-mix(in srgb, ${accentColor} 5%, transparent);
    }
    
    .line-items-table .text-right {
      text-align: right;
    }
    
    .line-items-table .text-center {
      text-align: center;
    }
    
    .description-cell {
      font-weight: 500;
      color: #1e293b;
    }
    
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }
    
    .totals-card {
      background:color-mix(in srgb, ${accentColor} 5%, transparent);
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 28px;
      width: 100%;
      max-width: 380px;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .totals-row:last-child {
      border-bottom: none;
    }
    
    .totals-label {
      color: #64748b;
      font-size: 14px;
    }
    
    .totals-value {
      font-weight: 600;
      color: #1e293b;
      font-size: 15px;
    }
    
    .total-final {
      margin-top: 12px;
      padding-top: 16px;
      border-top: 2px solid ${accentColor};
    }
    
    .total-final .totals-label {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .total-final .totals-value {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: ${accentColor};
    }
    
    .tax-id-section {
      margin-top: 50px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 6px;
      border-left: 4px solid ${accentColor};
    }
    
    .tax-id-section strong {
      color: #1e293b;
      font-weight: 600;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }
    
    .footer-note {
      color: #64748b;
      font-size: 13px;
      font-style: italic;
      margin-bottom: 20px;
    }
    
    .watermark {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 16px;
      text-decoration: none;
    }
    
    .watermark:hover {
      color: ${accentColor};
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

    // Mock data for demo
    const mockData = data

    const finalData = data || mockData;

    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </head>
            <body>
                <div className="page">
                    <div className="header-banner">
                        <div className="header-content">
                            <div className="logo-section">
                                {finalData.profile.avatar_url ? (
                                    <img src={finalData.profile.avatar_url} alt="Logo" className="logo" />
                                ) : (
                                    <h2 className="company-name-header">
                                        {finalData.profile.company_name || finalData.profile.full_name}
                                    </h2>
                                )}
                            </div>
                            <div className="invoice-title">
                                <h1>INVOICE</h1>
                                <div className="invoice-meta">
                                    <div className="invoice-meta-item">
                                        <strong>Invoice #</strong>{finalData.invoice_number}
                                    </div>
                                    <div className="invoice-meta-item">
                                        <strong>Issued</strong>{formatDate(finalData.issue_date)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-section">
                        <div className="info-cards">
                            <div className="info-card">
                                <h3>From</h3>
                                <p className="name">{finalData.profile.company_name || finalData.profile.full_name}</p>
                                <p>{finalData.profile.address_line_1}</p>
                                <p>{finalData.profile.city}, {finalData.profile.country}</p>
                                <p>{finalData.profile.email}</p>
                            </div>

                            <div className="info-card">
                                <h3>Bill To</h3>
                                <p className="name">{finalData.client.name}</p>
                                <p>{finalData.client.address_line_1}</p>
                                <p>{finalData.client.city}, {finalData.client.country}</p>
                                <p>{finalData.client.email}</p>
                            </div>

                            {finalData.due_date && (
                                <div className="info-card payment-due-highlight">
                                    <h3>Payment Due</h3>
                                    <p className="name">{formatDate(finalData.due_date)}</p>
                                    <div className="due-amount">{currencySymbol}{finalData.total.toFixed(2)}</div>
                                </div>
                            )}
                        </div>

                        <div className="line-items-wrapper">
                            <table className="line-items-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-right">Unit Price</th>
                                        <th className="text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finalData.invoice_line_items.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="description-cell">{item.description}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-right">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                                            <td className="text-right">{currencySymbol}{(item.quantity * item.unit_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="totals-section">
                            <div className="totals-card">
                                <div className="totals-row">
                                    <span className="totals-label">Subtotal</span>
                                    <span className="totals-value">{currencySymbol}{finalData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="totals-row">
                                    <span className="totals-label">Tax ({finalData.tax_rate}%)</span>
                                    <span className="totals-value">{currencySymbol}{finalData.tax_amount.toFixed(2)}</span>
                                </div>
                                <div className="totals-row total-final">
                                    <span className="totals-label">Total Amount</span>
                                    <span className="totals-value">{currencySymbol}{finalData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {finalData.profile.tax_id && (
                            <div className="tax-id-section">
                                <strong>Tax ID:</strong> {finalData.profile.tax_id}
                            </div>
                        )}

                        <div className="footer">
                            <p className="footer-note">{finalData.notes || 'Thank you for your business!'}</p>
                            {showWatermark && (
                                <a href="https://sheet2bill.com" className="watermark">
                                    <Logo className="h-4 w-4" />
                                    <span style={{ fontWeight: 600 }}>Sheet2Bill</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}