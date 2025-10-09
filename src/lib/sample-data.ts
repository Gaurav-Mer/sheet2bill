// lib/sample-data.ts
export const sampleInvoiceData = {
    invoice_number: 'PREVIEW-001',
    issue_date: new Date().toISOString(),
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    currency: 'INR',
    client: { name: 'Acme Corporation', email: 'contact@acme.inc', address_line_1: '123 Main St', city: 'Anytown', country: 'USA' },
    profile: { company_name: 'Your Company', full_name: 'Your Name', email: 'you@yourcompany.com', address_line_1: '456 Business Rd', city: 'Your City', country: 'Your Country' },
    invoice_line_items: [
        { description: 'Website Design & Development', quantity: 1, unit_price: 50000 },
        { description: 'Monthly SEO Services', quantity: 1, unit_price: 15000 },
    ],
    subtotal: 65000,
    tax_rate: 18,
    tax_amount: 11700,
    total: 76700,
    notes: 'Thank you for your business. Payment is due within 14 days.',
};