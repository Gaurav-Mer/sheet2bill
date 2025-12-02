/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/invoice/[token].tsx
import { CurrentTemplate } from '@/components/templates/CurrentTemplate';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';
import { HardDriveDownloadIcon, Share2 } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';


// This page's job is just to display the invoice.
export default function PublicInvoicePage({ invoice }: { invoice: any }) {
    if (!invoice) {
        // This is a fallback, but getServerSideProps should handle the "not found" case.
        return <div>Invoice not found or you do not have permission to view it.</div>;
    }

    // CORRECTED: We must pass mode="web" to prevent hydration errors.
    return (
        <>{/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">

                {/* Download PDF */}
                <Button
                    className="shadow-lg rounded-full px-5 py-3 text-sm"
                    variant="secondary"
                >
                    <a
                        href={`/api/invoices/${invoice.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full"
                    >
                    </a>
                    <HardDriveDownloadIcon size={30} /> Download PDF
                </Button>

                {/* Share Invoice */}
                <Button
                    className="shadow-lg rounded-full px-5 py-3 text-sm"
                    variant="secondary"
                    onClick={async () => {
                        const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${invoice.invoice_token}`;

                        if (navigator.share) {
                            try {
                                await navigator.share({
                                    title: "Invoice",
                                    text: "Here is your invoice",
                                    url: shareUrl,
                                });
                            } catch (err) {
                                console.error("Share cancelled:", err);
                            }
                        } else {
                            await navigator.clipboard.writeText(shareUrl);
                            alert("Invoice link copied to clipboard!");
                        }
                    }}
                >
                    <Share2 size={30} />  Share Invoice
                </Button>
            </div>

            <CurrentTemplate templateId={invoice?.template_id ?? undefined} data={invoice as any} />
        </>
    )
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