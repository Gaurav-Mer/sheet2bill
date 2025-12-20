import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';
import { Mail, MapPin } from 'lucide-react';

export default function ContactUsPage() {
    return (
        <>
            <Head>
                <title>Contact Us - Sheet2Bill</title>
                <meta name="description" content="Get in touch with the Sheet2Bill team for support, feedback, or business inquiries." />
            </Head>
            <NonLoginNavbar />
            <main className="bg-background mt-4">
                <div className="container mx-auto max-w-prose py-16 px-6">
                    <article className="prose dark:prose-invert">
                        <h1>Contact Us</h1>
                        <p className="lead text-muted-foreground">
                            We are here to help! Whether you have questions about your subscription, need technical support, or just want to give feedback, please reach out to us.
                        </p>

                        <div className="my-8 space-y-6">
                            {/* Email Support */}
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mt-0">Email Support</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        For all inquiries, please email us. We typically respond within 24-48 hours.
                                    </p>
                                    <a href="mailto:admin@sheet2bill.com" className="text-primary font-medium hover:underline">
                                        admin@sheet2bill.com
                                    </a>
                                </div>
                            </div>

                            {/* Registered Address */}
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mt-0">Registered Office</h3>
                                    <p className="text-sm text-muted-foreground mb-0">
                                        Sheet2Bill (Individual Sole Proprietorship)<br />
                                        {/* REPLACE THIS with your actual address provided to Razorpay */}
                                        123, Freelancer Street,<br />
                                        Jaipur, Rajasthan, India - 302001
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2>Business Hours</h2>
                        <p>
                            Our support team is available Monday through Friday, 10:00 AM to 6:00 PM IST. Inquiries received during weekends or holidays will be addressed on the next business day.
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

ContactUsPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};