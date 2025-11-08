/* eslint-disable react/no-unescaped-entities */
import { ReactElement } from 'react';
// import Link from 'next/link'; // Replaced with <a> tag
import { Info } from 'lucide-react';
import Link from 'next/link';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';

export default function RefundPolicyPage() {
    return (
        <>
            <NonLoginNavbar />
            <main className="bg-background mt-4">
                <div className="container mx-auto max-w-prose py-16 px-6">
                    <article className="prose dark:prose-invert">
                        <h1>Refund Policy for Sheet2Bill</h1>
                        <p className="lead">Last updated: October 12, 2025</p>

                        {/* --- BETA NOTICE BANNER --- */}
                        <div className="my-6 rounded-md bg-blue-50 p-4 border-l-4 border-blue-500 dark:bg-blue-900/30">
                            <div className="flex items-start gap-x-3">
                                <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />
                                <div className="text-sm">
                                    <p className="font-semibold text-blue-800 dark:text-blue-300">Public Beta Offer</p>
                                    <p className="mt-1 text-blue-700 dark:text-blue-400">
                                        Sheet2Bill is currently free for all users until <strong>January 31st, 2026</strong>. The following policy, including the 7-day trial, will apply to all paid subscriptions after this date.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* --------------------------- */}

                        <h2>1. 7-Day Free Trial</h2>
                        <p>
                            We offer a 7-day free trial for all new users. During the trial, you have full access to all features of the selected plan to determine if Sheet2Bill is the right fit for your needs.
                        </p>
                        <p>
                            It is your responsibility to use the trial period to evaluate the service. We encourage you to test all features thoroughly before your trial ends.
                        </p>

                        <h2>2. Subscription Payments Are Non-Refundable</h2>
                        <p>
                            Once your 7-day free trial ends and your first subscription payment is processed, that payment is **final and non-refundable**.
                        </p>
                        <p>
                            By providing your payment information and subscribing after the trial, you are agreeing to these terms. We do not offer refunds or credits for payments made after a successful trial period.
                        </p>

                        <h2>3. Subscription Renewals</h2>
                        <p>
                            To ensure uninterrupted service, your subscription will automatically renew at the end of each billing cycle (monthly or annually). **Renewal payments are also non-refundable.**
                        </p>
                        <p>
                            You can cancel your subscription at any time from your account settings to prevent future charges.
                        </p>

                        <h2>4. How to Cancel Your Subscription</h2>
                        <p>
                            You are in full control of your subscription. To avoid being charged after your trial or for a renewal, you must cancel your subscription before the billing date. You can do this from the "Billing" or "Account" section of your dashboard.
                        </p>

                        <p className="mt-8">
                            <Link href="/" className="no-underline hover:underline">← Back to Home</Link>
                        </p>
                    </article>
                </div>
            </main>
        </>
    );
}

RefundPolicyPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};