/* eslint-disable react/no-unescaped-entities */
import { ReactElement } from 'react';
import Link from 'next/link';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import Head from 'next/head';

export default function RefundPolicyPage() {
    return (
        <>
            <Head>
                <title>Refund Policy - Sheet2Bill</title>
                <meta name="description" content="Read the Sheet2Bill refund policy regarding prepaid passes and cancellations." />
            </Head>
            <NonLoginNavbar />
            <main className="bg-background mt-4">
                <div className="container mx-auto max-w-prose py-16 px-6">
                    <article className="prose dark:prose-invert">
                        <h1>Refund Policy for Sheet2Bill</h1>
                        <p className="lead text-muted-foreground">Last updated: December 13, 2025</p>

                        <h2>1. No Automatic Renewals</h2>
                        <p>
                            Sheet2Bill operates on a <strong>Prepaid Pass</strong> model. You manually purchase access for a specific duration (e.g., 30 days or 1 year). We do <strong>not</strong> automatically charge your card or bank account when your pass expires. You are always in full control of when you pay.
                        </p>

                        <h2>2. Refund Eligibility</h2>
                        <p>
                            Because our "Pro Pass" provides immediate access to digital features (such as premium templates and unlimited usage), all sales are generally <strong>final and non-refundable</strong> once the payment is successfully processed and the features are unlocked.
                        </p>
                        <p>
                            However, we understand that technical errors happen. We may consider a refund request under the following specific circumstances:
                        </p>
                        <ul>
                            <li><strong>Double Charge:</strong> If you were charged twice for the same transaction due to a technical glitch.</li>
                            <li><strong>Service Unavailability:</strong> If a critical feature of the Pro plan was technically unavailable for more than 72 hours immediately following your purchase.</li>
                        </ul>

                        <h2>3. Requesting a Refund</h2>
                        <p>
                            If you believe you are eligible for a refund based on the criteria above, you must contact us within <strong>7 days</strong> of the transaction date.
                        </p>
                        <p>
                            To request a refund, please email <strong>admin@sheet2bill.com</strong> with:
                        </p>
                        <ul>
                            <li>Your registered email address.</li>
                            <li>The Payment ID (e.g., pay_H23...) found in your Billing history.</li>
                            <li>A description of the issue.</li>
                        </ul>
                        <p>
                            Refunds are granted at our sole discretion. If approved, the refund will be processed to your original payment method within 5-10 business days.
                        </p>

                        <h2>4. Cancellations & Downgrades</h2>
                        <p>
                            Since there are no automatic recurring charges, there is no need to "cancel" a subscription to stop future payments. If you do not wish to continue using the Pro features, simply do not purchase a new pass when your current one expires. Your account will automatically revert to the Free Plan limits.
                        </p>

                        <p className="mt-8 border-t pt-8">
                            <Link href="/" className="no-underline hover:underline text-primary">← Back to Home</Link>
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