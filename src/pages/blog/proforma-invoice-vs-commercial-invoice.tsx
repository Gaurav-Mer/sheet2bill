/* eslint-disable react/no-unescaped-entities */
import React, { ReactElement } from 'react';
import { Calendar, Clock, ArrowRight, CheckCircle2, FileText, Info, HelpCircle, UserPlus, Send, FileCheck, Scale, AlertCircle } from 'lucide-react';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

const ProformaBlogPost = () => {
    const post = {
        title: 'Proforma Invoice vs. Commercial Invoice: Key Differences & When to Use Each',
        metaDescription:
            'Confused about proforma vs. commercial invoices? Explore our definitive guide on billing workflows, legal differences, and how to use Sheet2Bill briefs for seamless client approvals.',
        publishedAt: '2026-04-21',
        keywords: [
            'proforma invoice vs commercial invoice',
            'what is a proforma invoice',
            'commercial invoice meaning',
            'billing workflow for freelancers',
            'invoice approval process'
        ],
        readTime: '8 min read'
    };
    const router = useRouter();

    return (
        <>
            <Head>
                <title>{post.title} — Sheet2Bill Blog</title>
                <meta name="description" content={post.metaDescription} />
                <meta name="keywords" content={post.keywords.join(', ')} />
                <meta name="author" content="Sheet2Bill" />
                <link rel="canonical" href="https://www.sheet2bill.com/blog/proforma-invoice-vs-commercial-invoice" />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.metaDescription} />
                <meta property="og:url" content="https://www.sheet2bill.com/blog/proforma-invoice-vs-commercial-invoice" />
                <meta property="og:type" content="article" />
                <meta property="og:image" content="https://www.sheet2bill.com/landing.png" />
                <meta property="article:published_time" content={post.publishedAt} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.metaDescription} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": post.title,
                        "description": post.metaDescription,
                        "datePublished": post.publishedAt,
                        "author": { "@type": "Organization", "name": "Sheet2Bill" },
                        "publisher": { "@type": "Organization", "name": "Sheet2Bill", "url": "https://www.sheet2bill.com" },
                        "url": "https://www.sheet2bill.com/blog/proforma-invoice-vs-commercial-invoice"
                    })
                }} />
            </Head>
            <NonLoginNavbar />
            <div className="min-h-dvh bg-white">
                <header className="border-b border-gray-200 mt-16">
                    <div className="max-w-3xl mx-auto px-6 py-6">
                        <Link
                            href="/blog"
                            className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                        >
                            ← Back to Blog
                        </Link>
                    </div>
                </header>

                <article className="md:max-w-4xl mx-auto px-6">
                    <div className="py-12 border-b border-gray-100 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-500 mb-6">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                            <span>·</span>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                            Stop sending invoices that get disputed. Learn how to use <strong>Proforma documents</strong> to lock in client agreement before the bill ever hits their inbox.
                        </p>
                    </div>

                    <div className="py-12 space-y-16">
                        {/* THE BIG EXPANDED SECTION */}
                        <section className="prose prose-lg max-w-none text-gray-700">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Definitive Breakdown: Proforma vs. Commercial</h2>
                            <p className="text-lg leading-relaxed mb-6">
                                If you have ever had a client reply to an invoice with "Wait, what is this charge?", you have experienced an <strong>Invoice Ambush</strong>. Professional billing avoids this by separating <em>agreement</em> from <em>payment</em>.
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 my-10">
                                <div className="p-8 bg-primary/10 rounded-2xl border border-primary">
                                    <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                                        <Scale className="w-6 h-6" /> Proforma Invoice
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        Known as a <strong>"Brief"</strong> in Sheet2Bill, this is a preliminary bill of sale. It acts as a "Good Faith" agreement.
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex gap-2">✅ Used for client approval</li>
                                        <li className="flex gap-2">✅ Not a tax document</li>
                                        <li className="flex gap-2">✅ Can be edited or rejected</li>
                                        <li className="flex gap-2">✅ Does not require immediate payment</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-green-50 rounded-2xl border border-green-100">
                                    <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                                        <FileCheck className="w-6 h-6" /> Commercial Invoice
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        The final, legally binding document. This is what the accounting department uses to process the bank transfer.
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex gap-2">✅ Legally binding demand for pay</li>
                                        <li className="flex gap-2">✅ Used for tax & accounting</li>
                                        <li className="flex gap-2">✅ Unique sequential invoice number</li>
                                        <li className="flex gap-2">✅ Declares final VAT/GST/Tax math</li>
                                    </ul>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">When Should You Use Each?</h3>
                            <p className="text-lg leading-relaxed mb-6">
                                Understanding the timing is crucial for maintaining cash flow. You should issue a <strong>Proforma</strong> at the start of a project or milestone. It protects you by getting the client to commit to the numbers in writing.
                            </p>
                            <p className="text-lg leading-relaxed mb-6">
                                Once the work is done and the client has clicked "Accept" on your Sheet2Bill Brief, you then generate the <strong>Commercial Invoice</strong>. This creates a clear trail: the client cannot dispute the final invoice because they already approved the Proforma.
                            </p>
                        </section>

                        {/* COMPARISON TABLE - HIGH SEO VALUE */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Comparison</h2>
                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-900">Feature</th>
                                            <th className="p-4 font-bold text-gray-900">Proforma (Brief)</th>
                                            <th className="p-4 font-bold text-gray-900">Commercial Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="p-4 font-semibold italic text-gray-800">Legal Status</td>
                                            <td className="p-4 text-gray-600 italic">Informal Agreement</td>
                                            <td className="p-4 text-gray-600 italic">Binding Contract</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-semibold text-gray-800">Sequential Numbering</td>
                                            <td className="p-4 text-gray-600">Not Required</td>
                                            <td className="p-4 text-gray-600">Mandatory (e.g. INV-001)</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-semibold text-gray-800">Bookkeeping</td>
                                            <td className="p-4 text-gray-600">Not recorded in A/R</td>
                                            <td className="p-4 text-gray-600">Recorded as Revenue</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-semibold text-gray-800">Modifications</td>
                                            <td className="p-4 text-gray-600">Easily editable</td>
                                            <td className="p-4 text-gray-600">Requires Credit Note if changed</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* WORKFLOW SECTION */}
                        <section className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl">
                            <h2 className="text-3xl font-bold mb-10 text-center">The Sheet2Bill "Approval-First" Workflow</h2>

                            <div className="grid md:grid-cols-3 gap-10 relative">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-xl">1</div>
                                    <h4 className="text-xl font-bold">Register Client</h4>
                                    <p className=" text-sm leading-relaxed">Add your contact to the CRM. Every professional invoice needs a verified client profile to ensure legal compliance in the US and India.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-xl">2</div>
                                    <h4 className="text-xl font-bold">Issue the Brief</h4>
                                    <p className=" text-sm leading-relaxed">List your items. Your client receives a link where they can <strong>Accept</strong> or <strong>Reject</strong> individual lines. This is your Proforma stage.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                                    <h4 className="text-xl font-bold">Manual Conversion</h4>
                                    <p className=" text-sm leading-relaxed">Once accepted, you manually hit <strong>"Convert to Invoice"</strong>. Sheet2Bill then generates the final commercial PDF with a sequential invoice number.</p>
                                </div>
                            </div>
                        </section>

                        {/* TAX COMPLIANCE SECTION */}
                        <section className="prose prose-lg max-w-none text-gray-700 border-t border-gray-100 pt-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Professionals Prefer Manual Conversion</h2>
                            <p className="mb-4">
                                While automation is great, <strong>manual conversion</strong> from a brief to an invoice is a key feature for high-income freelancers. Why?
                            </p>
                            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 flex gap-4 items-start">
                                <AlertCircle className="text-amber-600 flex-shrink-0 w-6 h-6 mt-1" />
                                <div className="text-sm text-amber-900">
                                    <strong>Tax Warning:</strong> In many jurisdictions, once a Commercial Invoice is generated, it is legally recorded for taxes. Auto-generating these before a client is ready can result in you paying taxes on money you haven't actually collected yet.
                                </div>
                            </div>
                            <p className="mt-6">
                                Sheet2Bill gives you the "Final Check." You review the accepted brief, ensure the Razorpay settings (INR/USD) are correct, and then trigger the final PDF generation.
                            </p>
                        </section>

                        {/* FAQ */}
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <HelpCircle className="text-gray-500" /> Common Billing Questions
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Can a proforma invoice be used for payment?</h4>
                                    <p className="text-gray-700 text-sm">Technically, yes, for advance payments. However, the client will still need a commercial invoice later to reconcile their books and claim tax credits.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">What happens if a brief is rejected?</h4>
                                    <p className="text-gray-700 text-sm">If a client rejects an item in Sheet2Bill, you can modify the line items and re-send. This keeps your legal invoice numbering sequence clean of "Cancelled" or "Voided" documents.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="py-12 border-t border-gray-100">
                        <div className="bg-primary text-white rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4">
                                    Master Your Billing Workflow Today
                                </h3>
                                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                    Join thousands of freelancers who use Sheet2Bill to manage clients, get brief approvals, and generate pro-grade invoices.
                                </p>
                                <Button
                                    onClick={() => router.push("/signup")}
                                    className="bg-white hover:bg-white text-primary py-7 px-12  font-semibold shadow-xl transition-all transform hover:scale-105"
                                >
                                    Try Sheet2Bill Free
                                    <ArrowRight className="ml-2 w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </article>

                <Footer />
            </div>
        </>
    );
};

export default ProformaBlogPost;

ProformaBlogPost.getLayout = function getLayout(page: ReactElement) {
    return page;
};