/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Download } from 'lucide-react';
import { ReactElement } from 'react';
import { Logo } from '@/components/Logo';

export default function ReceiptPage({ payment, profile }: any) {

    if (!payment) return <div className="p-10 text-center">Receipt not found.</div>;

    const amount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: payment.currency || 'INR'
    }).format(payment.amount / 100);

    return (
        <>
            <Head>
                <title>Receipt #{payment.invoice_number}</title>
            </Head>

            {/* Added print:h-auto and print:overflow-visible to prevent cutting off or extra pages */}
            <div className="h-dvh md:p-4 bg-gray-50 flex flex-col items-center justify-start print:bg-white print:p-0 print:h-auto print:overflow-visible">

                {/* Manual Action Bar - Hidden in Print */}
                <button
                    onClick={() => window.print()}
                    className="flex items-center print:hidden  absolute right-4 bottom-2 md:bottom-12 gap-2 bg-secondary text-black px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors shadow-sm"
                >
                    <Download size={16} />
                    Download PDF
                </button>

                {/* Receipt Card */}
                <div className="bg-white p-8 md:p-12 max-w-2xl h-full w-full shadow-lg border rounded-lg print:shadow-none print:border-none print:w-full print:max-w-none print:m-0">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 border-b pb-8">
                        <div>
                            <div className='flex items-center gap-2'>
                                <Logo />
                                <h1 className="text-2xl font-bold text-gray-900">Sheet2Bill</h1>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Receipt for Payment</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-mono font-medium text-gray-600">PAID</h2>
                            <p className="text-sm text-gray-400 mt-1">#{payment.invoice_number}</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</h3>
                            <p className="font-medium text-gray-900">{profile?.full_name || profile?.email}</p>
                            <p className="text-gray-600 text-sm">{profile?.email}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</h3>
                            <p className="font-medium text-gray-900">
                                {new Date(payment.created_at).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="text-left py-3 text-sm font-bold text-gray-500">Description</th>
                                    <th className="text-right py-3 text-sm font-bold text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-50">
                                    <td className="py-4 text-gray-900">
                                        <p className="font-medium">{payment.description || 'Sheet2Bill Pro Subscription'}</p>
                                        <p className="text-sm text-gray-500 mt-1">Transaction ID: {payment.razorpay_payment_id}</p>
                                    </td>
                                    <td className="py-4 text-right font-medium text-gray-900">
                                        {amount}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-12">
                        <div className="w-1/2">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">{amount}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Total Paid</span>
                                <span className="font-bold text-xl text-primary">{amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-400 mt-12 pt-8 border-t">
                        <p>Thank you for your business!</p>
                        <p className="mt-2 text-xs">If you have any questions about this receipt, please contact admin@sheet2bill.com</p>
                    </div>

                </div>
            </div>

            {/* Styles to clean up print view */}
            <style jsx global>{`
                @media print {
                    /* Remove default margins */
                    @page { margin: 0; size: auto; }
                    
                    /* Force background colors */
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white; }
                    
                    /* Hide everything that is NOT the nextjs app container or our specific content */
                    /* This is a fallback in case getLayout misses something external */
                    body > *:not(#__next) { display: none; }
                }
            `}</style>
        </>
    );
}

// 1. This disables the default Navbar/Sidebar layout for this page
ReceiptPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { id } = ctx.query;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { redirect: { destination: '/login', permanent: false } };

    const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!payment) {
        return { notFound: true };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return {
        props: {
            payment,
            profile
        }
    };
};