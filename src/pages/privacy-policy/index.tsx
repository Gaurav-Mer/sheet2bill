/* eslint-disable react/no-unescaped-entities */
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';
// import Link from 'next/link'; // Replaced with standard <a> tag for compatibility

export default function PrivacyPolicyPage() {
    return (
        <>
            <Head>
                <title>Privacy Policy - Sheet2Bill</title>
                <meta name="description" content="Read the Sheet2Bill privacy policy to understand how we collect, use, and protect your data." />
            </Head>
            <NonLoginNavbar />
            <main className="bg-background mt-4">
                <div className="container mx-auto max-w-prose py-16 px-6">
                    <article className="prose dark:prose-invert">
                        <h1>Privacy Policy for Sheet2Bill</h1>
                        <p className="lead">Last updated: October 12, 2025</p>

                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Sheet2Bill ("we," "us," or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application (the "Service"). If you have any questions, please contact us at <strong>[Your Contact Email, e.g., admin@sheet2bill.com]</strong>.
                        </p>

                        <h2>2. Information We Collect</h2>
                        <p>We may collect information about you in a variety of ways. This includes data you provide directly and data collected automatically through your use of the Service.</p>

                        <h3>A. Personal Data You Provide</h3>
                        <ul>
                            <li><strong>Account Information:</strong> When you register, we collect your email address and a securely hashed password.</li>
                            <li><strong>Profile & Business Information:</strong> We collect details you voluntarily add, such as your name, company name, address, and logo.</li>
                            <li><strong>Client & Financial Data:</strong> We store the data you create to provide our core services, including your client's details, and the content of your briefs and invoices (work descriptions, rates, etc.).</li>
                        </ul>

                        <h3>B. Data Collected Automatically</h3>
                        <ul>
                            <li><strong>Usage Data:</strong> We may collect information your browser sends whenever you visit our Service, such as your IP address, browser type, and the pages you visit.</li>
                            <li><strong>Cookies:</strong> We use cookies to manage your session and help you stay logged in. You can instruct your browser to refuse cookies, but some parts of our Service may not function correctly without them.</li>
                        </ul>

                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect for several purposes:</p>
                        <ul>
                            <li><strong>To Provide and Maintain the Service:</strong> To create your account, generate briefs and invoices, and enable all core features.</li>
                            <li><strong>To Manage Your Account:</strong> To facilitate account creation, authentication, and secure password resets.</li>
                            <li><strong>To Communicate With You:</strong> To send important service-related notifications, such as security alerts or when a brief is approved.</li>
                            <li><strong>To Improve Our Service:</strong> To understand how our users interact with the platform so we can enhance the user experience.</li>
                        </ul>

                        <h2>4. How We Share Your Information</h2>
                        <p>We do not sell your personal data. We only share information with trusted third-party services that are essential for operating our platform:</p>
                        <ul>
                            <li><strong>Supabase:</strong> Our primary infrastructure provider for database hosting, authentication, and file storage.</li>
                            <li><strong>Vercel:</strong> For hosting our web application.</li>
                            <li><strong>Payment Processors (e.g., Stripe/Razorpay):</strong> For processing subscription payments. We do not store or have access to your full credit card information.</li>
                            <li><strong>Email Services (e.g., Resend):</strong> For sending transactional and notification emails.</li>
                        </ul>
                        <p>We may also disclose your information if required by law or to protect our rights and the safety of our users.</p>

                        <h2>5. Data Security</h2>
                        <p>
                            The security of your data is a top priority. Our database is powered by Supabase, which provides industry-standard security, including encryption at rest and in transit. We utilize Supabase's <strong>Row Level Security (RLS)</strong>, which enforces a strict policy ensuring that you are the only person who can ever access your own data. While we take strong measures to protect your information, no security system is impenetrable.
                        </p>

                        <h2>6. Data Retention</h2>
                        <p>
                            We will retain your personal information for as long as your account is active or as needed to provide you with the Service. We may also retain your information as necessary to comply with legal obligations or resolve disputes.
                        </p>

                        <h2>7. Your Data Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information at any time through your account dashboard. If you wish to permanently delete your account and all associated data, please contact us directly.
                        </p>

                        <h2>8. Children's Privacy</h2>
                        <p>Our Service is not intended for use by anyone under the age of 13. We do not knowingly collect personally identifiable information from children.</p>

                        <h2>9. Changes to This Privacy Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date at the top.</p>

                        <p className="mt-8">
                            <Link href="/" className="no-underline hover:underline">← Back to Home</Link>
                        </p>
                    </article>
                </div>
            </main>
        </>
    );
}

// This page does not use the main app layout with the sidebar
PrivacyPolicyPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};

