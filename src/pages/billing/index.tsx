import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types';
import { CheckCircle2, AlertCircle, CalendarClock, Zap, Receipt } from 'lucide-react';
import Link from 'next/link';
import { isAfter, differenceInDays, format } from 'date-fns';

// Define the shape of a Payment record
type Payment = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    razorpay_payment_id?: string;
    description?: string;
};

type BillingPageProps = {
    profile: Profile | null;
    payments: Payment[];
};

export default function BillingPage({ profile, payments }: BillingPageProps) {

    // 1. Logic to check if plan is active (Date-based)
    const isActivePro = profile?.subscription_ends_at
        ? isAfter(new Date(profile.subscription_ends_at), new Date())
        : false;

    const endDate = profile?.subscription_ends_at ? new Date(profile.subscription_ends_at) : null;
    const daysLeft = endDate ? Math.max(0, differenceInDays(endDate, new Date())) : 0;

    return (
        <div className="container ">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Billing & Plan</h1>
                    <p className="text-muted-foreground mt-2">Manage your subscription and view billing status.</p>
                </div>

                {/* --- Current Plan Status Card --- */}
                <Card className={`shadow-lg border-l-4 ${isActivePro ? 'border-l-green-500 border-green-100' : 'border-l-gray-300'}`}>
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                        <div className="flex-shrink-0">
                            {isActivePro ? (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <Zap className="h-6 w-6 text-green-600 fill-green-600" />
                                </div>
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                    <AlertCircle className="h-6 w-6 text-gray-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-xl">
                                {isActivePro ? "Pro Pass Active" : "Starter Plan (Free)"}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                {isActivePro
                                    ? "You have full access to all premium features."
                                    : "You are currently on the limited free plan."}
                            </CardDescription>
                        </div>
                        {isActivePro && (
                            <div className="text-right">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                    Active
                                </span>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {isActivePro ? (
                                <>
                                    <div className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <CalendarClock size={16} />
                                            <span>Expires On</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            {endDate ? format(endDate, 'MMMM d, yyyy, hh:mm') : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <CheckCircle2 size={16} />
                                            <span>Days Remaining</span>
                                        </div>
                                        {daysLeft === 0 ? <p className='text-des'>Plan expiring today</p> : <p className="text-lg font-semibold text-primary">
                                            {daysLeft} Days
                                        </p>}
                                    </div>
                                </>
                            ) : (
                                <div className="col-span-2 p-4 bg-secondary/20 rounded-lg border border-border/50">
                                    <p className="text-sm font-medium">Free Plan Limits:</p>
                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-4">
                                        <li>3 Briefs per month</li>
                                        <li>5 Service Items in library</li>
                                        <li>2 Saved Clients</li>
                                        <li>Sheet2Bill Watermark on invoices</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="bg-muted/20 border-t pt-6">
                        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                                {isActivePro
                                    ? "Need more time? Buying another pass adds 30 days to your current expiry."
                                    : "Upgrade to remove limits and unlock professional features."}
                            </p>
                            <Link href="/pricing" passHref className="w-full sm:w-auto">
                                <Button className={`w-full sm:w-auto ${isActivePro ? "bg-primary" : "bg-gradient-to-r from-primary to-primary/80 text-white shadow-sm hover:shadow-md"} transition-all`}>
                                    {isActivePro ? "Extend Pass" : "Upgrade to Pro"}
                                </Button>
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                {/* --- Payment History Section --- */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-gray-500" />
                            Payment History
                        </CardTitle>
                        <CardDescription>
                            A list of your recent transactions and top-ups.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {payments && payments.length > 0 ? (
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm text-left">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Description</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle">
                                                    {format(new Date(payment.created_at), 'MMM d, yyyy')}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{payment.description || 'Pro Plan Top-up'}</span>
                                                        <span className="text-xs text-muted-foreground uppercase">{payment.razorpay_payment_id}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle font-medium">
                                                    {new Intl.NumberFormat('en-IN', {
                                                        style: 'currency',
                                                        currency: payment.currency || 'INR'
                                                    }).format(payment.amount / 100)}
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize 
                                                        ${payment.status === 'captured' || payment.status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground bg-secondary/10 rounded-lg border border-dashed">
                                <Receipt className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                                <p>No payment history found.</p>
                                <p className="text-xs mt-1">Your recent transactions will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) {
        return { redirect: { destination: '/login', permanent: false } };
    }

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_ends_at, plan_type') // Fetch relevant fields for the new logic
        .eq('id', user.id)
        .single();

    // 2. Fetch Payment History (Assumes 'payments' table exists)
    // Note: If you haven't created the 'payments' table yet, this might return null/error.
    // Ensure you create it or handle the error gracefully.
    const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (paymentError) {
        console.warn("Could not fetch payments:", paymentError.message);
    }

    return {
        props: {
            profile: profile || null,
            payments: payments || [],
        },
    };
};