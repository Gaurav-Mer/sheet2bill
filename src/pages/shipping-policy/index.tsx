import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';

export default function ShippingPolicyPage() {
    return (
        <>
            <Head>
                <title>Shipping Policy - Sheet2Bill</title>
            </Head>
            <NonLoginNavbar />
            <main className="bg-background mt-4">
                <div className="container mx-auto max-w-prose py-16 px-6">
                    <article className="prose dark:prose-invert">
                        <h1>Shipping & Delivery Policy</h1>
                        <p className="lead text-muted-foreground">Last updated: December 13, 2025</p>

                        <p>
                            **Sheet2Bill is a digital product.** We do not sell or ship physical goods.
                        </p>

                        <h2>Instant Delivery</h2>
                        <p>
                            Upon successful payment for a Pro Pass or other digital service, your account is automatically updated, and the features are instantly available for use. No waiting period applies.
                        </p>

                        <h2>Confirmation</h2>
                        <p>
                            Your payment status will be updated instantly in your account dashboard. You can view your transaction history details in the &quot;Billing&quot; section at any time.
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

ShippingPolicyPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};