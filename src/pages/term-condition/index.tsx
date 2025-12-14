/* eslint-disable react/no-unescaped-entities */
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';

export default function TermsOfServicePage() {
    return (
        <>
            <Head>
                <title>Terms of Service - Sheet2Bill</title>
                <meta name="description" content="Read the Sheet2Bill terms of service regarding accounts, payments, and usage limits." />
            </Head>
            <NonLoginNavbar />
            <main className="bg-background mt-4">
                <div className="container mx-auto max-w-prose py-16 px-6">
                    <article className="prose dark:prose-invert">
                        <h1>Terms of Service</h1>
                        <p className="lead text-muted-foreground">Last updated: December 13, 2025</p>

                        <p>
                            Please read these Terms of Service ("Terms") carefully before using the Sheet2Bill application (the "Service") operated by us. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                        </p>

                        <h2>1. Accounts</h2>
                        <p>
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding your password and for any activities or actions under your password.
                        </p>

                        <h2>2. Subscription & Payments</h2>
                        <h3>2.1 Prepaid Passes</h3>
                        <p>
                            Sheet2Bill operates on a "Prepaid Pass" model. Users may purchase a Pro Pass for a specific duration (e.g., 30 days or 1 year). This is a one-time payment and <strong>not an automatic recurring subscription</strong>. We do not store your credit card information; payments are processed securely via our third-party partner, Razorpay.
                        </p>

                        <h3>2.2 Plan Limits & Downgrades</h3>
                        <p>
                            If you do not purchase a new pass before your current pass expires, your account will automatically revert to the "Free Plan". Under the Free Plan, access to certain features (e.g., creating more than 3 briefs/month, premium templates) will be restricted. Your data will not be deleted, but you will need to upgrade to create new content beyond the free limits.
                        </p>

                        <h3>2.3 Refunds</h3>
                        <p>
                            Due to the digital nature of the Service, all sales are generally final. However, if you experienced a technical error during purchase, please contact us within 7 days. Refunds are processed at our sole discretion. Please refer to our separate <Link href="/legal/refund-policy">Refund Policy</Link> for full details.
                        </p>

                        <h2>3. Acceptable Use</h2>
                        <p>
                            You agree not to use the Service for any unlawful purpose. You agree not to misuse the service to send spam, fraudulent invoices, or engage in any activity that could harm the Service or its users. We reserve the right to ban users who attempt to bypass plan limits using automated scripts or bots.
                        </p>

                        <h2>4. User Content</h2>
                        <p>
                            You retain full ownership of the data you create on the Service ("User Content"). We do not claim ownership rights over your briefs, client lists, or invoices. You grant us a license solely to host and display this content to you and your designated clients.
                        </p>

                        <h2>5. Limitation Of Liability</h2>
                        <p>
                            In no event shall Sheet2Bill, nor its directors, employees, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
                        </p>

                        <h2>6. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.
                        </p>

                        <h2>7. Changes To Terms</h2>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                        </p>

                        <h2>8. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <ul className="list-none pl-0 font-medium">
                            <li>Email: admin@sheet2bill.com</li>
                            {/* Razorpay often requires a phone number or address for verification. Add it if you have one. */}
                            {/* <li>Phone: +91-9876543210</li> */}
                        </ul>

                        <p className="mt-8 border-t pt-8">
                            <Link href="/" className="no-underline hover:underline text-primary">← Back to Home</Link>
                        </p>
                    </article>
                </div>
            </main>
        </>
    );
}

TermsOfServicePage.getLayout = function getLayout(page: ReactElement) {
    return page;
};