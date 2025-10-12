/* eslint-disable react/no-unescaped-entities */
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import Link from 'next/link';
import { ReactElement } from 'react';
// import Link from 'next/link'; // Replaced with standard <a> tag for compatibility

export default function TermsOfServicePage() {
    return (
        <>
            <NonLoginNavbar />
            <main className="bg-background mt-4">
                <div className="container mx-auto max-w-prose py-16 px-6">
                    <article className="prose dark:prose-invert">
                        <h1>Terms of Service for Sheet2Bill</h1>
                        <p className="lead">Last updated: October 12, 2025</p>

                        <p>
                            Please read these Terms of Service ("Terms") carefully before using the Sheet2Bill application (the "Service") operated by us. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                        </p>

                        <h2>1. Accounts</h2>
                        <p>
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                        </p>

                        <h2>2. Subscriptions & Free Beta</h2>
                        <p>
                            The Service is currently offered under a "Free Beta" period. During this time, all features are provided free of charge until the specified end date (January 31st, 2026). We reserve the right to introduce paid subscription plans in the future. You will be given advance notice of any changes, and you will <strong>never be charged automatically</strong>. Moving to a paid plan will require your explicit consent and action.
                        </p>

                        <h2>3. Acceptable Use</h2>
                        <p>You agree not to use the Service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts. You agree not to misuse the service to send spam, fraudulent documents, or engage in any activity that could harm the Service or its users.</p>

                        <h2>4. User Content</h2>
                        <p>
                            You retain full ownership of the data you create on the Service, including client information, briefs, and invoices ("User Content"). We do not claim any ownership rights over your content. You grant us a limited license solely to host, display, and provide the Service to you.
                        </p>

                        <h2>5. Limitation Of Liability</h2>
                        <p>
                            In no event shall Sheet2Bill, nor its directors, employees, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses. The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind.
                        </p>

                        <h2>6. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms. You may terminate your account at any time by contacting us.
                        </p>

                        <h2>7. Changes To Terms</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                        </p>

                        <h2>8. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at <strong>[Your Contact Email, e.g., support@sheet2bill.com]</strong>.</p>

                        <p className="mt-8">
                            <Link href="/" className="no-underline hover:underline">← Back to Home</Link>
                        </p>
                    </article>
                </div>
            </main>
        </>
    );
}

// This page does not use the main app layout
TermsOfServicePage.getLayout = function getLayout(page: ReactElement) {
    return page;
};
