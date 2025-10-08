/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/invoice/[token].tsx
import { CurrentTemplate } from '@/components/templates/CurrentTemplate';
import { createClient } from '@supabase/supabase-js';
import { GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';


// This page's job is just to display the invoice.
export default function PublicInvoicePage({ invoice }: { invoice: any }) {
    if (!invoice) {
        // This is a fallback, but getServerSideProps should handle the "not found" case.
        return <div>Invoice not found or you do not have permission to view it.</div>;
    }

    // CORRECTED: We must pass mode="web" to prevent hydration errors.
    return <CurrentTemplate templateId={invoice?.template_id ?? undefined} data={invoice as any} />
}

// In pages/invoice/[token].tsx

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Use the service role key to bypass RLS for this public page
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { token } = ctx.params as { token: string };
    if (!token) return { notFound: true };

    // --- THIS IS THE CORRECTED QUERY ---
    // We specify the foreign key column for a clear and robust join.
    const { data: invoice, error } = await supabase
        .from('invoices')
        .select(`
            *, 
            client:clients!client_id(*), 
            invoice_line_items(*), 
            profile:profiles!user_id(*)
        `)
        .eq('invoice_token', token)
        .single();

    if (error || !invoice) {
        console.error("Error fetching public invoice:", error);
        return { notFound: true };
    }

    // The data is now correctly nested, e.g., invoice.client, invoice.profile
    return {
        props: {
            // We rename the nested data to match what our InvoiceTemplate component expects
            invoice: {
                ...invoice,
                clients: invoice.client,
                profiles: invoice.profile
            }
        }
    };
};

// This page should not have the main app layout
PublicInvoicePage.getLayout = function getLayout(page: ReactElement) {
    return page;
};