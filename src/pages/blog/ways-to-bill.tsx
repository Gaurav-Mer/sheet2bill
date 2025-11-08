/* eslint-disable react/no-unescaped-entities */
import React, { ReactElement } from 'react';
import { Calendar, Clock, ArrowRight, ThumbsUp, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BlogPost = () => {
    const post = {
        title: 'Stop Sending Invoices. Send "Briefs" Instead.',
        metaDescription:
            'Why just sending an invoice leads to payment delays. Learn how the "Approval-First" method of sending a brief for approval builds trust and gets you paid faster.',
        publishedAt: '2025-11-10',
        keywords: [
            'client invoice disputes',
            'how to prevent billing arguments',
            'pre-invoice approval',
            'freelance workflow'
        ],
        readTime: '6 min read'
    };
    const router = useRouter()

    return (
        <>
            <NonLoginNavbar />
            <div className="min-h-dvh bg-white">
                {/* Header */}
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

                {/* Article */}
                <article className="md:max-w-4xl mx-auto px-6">
                    <div className="py-12 border-b border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
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

                        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            {post.metaDescription}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="py-12 space-y-10">
                        {/* Opening */}
                        <section className="prose prose-lg max-w-none">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                What's the most dreaded email in a freelancer's inbox? It's not a
                                rejection. It's the reply to an invoice you just sent that starts
                                with, <strong>"Hey, just a quick question about this line item..."</strong>
                            </p>

                            <p className="text-lg text-gray-700 leading-relaxed">
                                That "quick question" is the start of a 3-day email chain, a delayed
                                payment, and a rising sense of frustration.
                            </p>

                            <p className="text-lg text-gray-700 leading-relaxed">
                                The problem isn't your invoice. The problem is that your client is
                                seeing the final, itemized bill for the first time — right when
                                you're asking for money. You've mixed two very different steps:
                                <em> review</em> and <em>payment</em>.
                            </p>

                            <p className="text-xl font-semibold text-gray-900 mt-6">
                                There’s a better way: The Approval-First Method.
                            </p>
                        </section>

                        {/* The Problem Section */}
                        <section className="bg-red-50 border-l-4 border-red-500 pl-8 py-8 rounded-r-2xl">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                The Problem: The “Invoice Ambush”
                            </h2>

                            <p className="text-lg text-gray-700 leading-relaxed mb-4">
                                When you send an invoice directly, you're unintentionally ambushing
                                your client with a bill. You're asking them to do two things at
                                once:
                            </p>

                            <ul className="list-disc ml-8 text-gray-700 space-y-2">
                                <li>
                                    <strong>Audit your work:</strong> “Does this look right? Is this
                                    what we agreed on?”
                                </li>
                                <li>
                                    <strong>Process a payment:</strong> “I need to send this to
                                    accounting.”
                                </li>
                            </ul>

                            <p className="text-lg text-gray-700 leading-relaxed mt-4">
                                If there’s any confusion in step one, it blocks step two — causing
                                delays and unnecessary disputes.
                            </p>
                        </section>

                        {/* Solution Section */}
                        <section className="bg-blue-50 border-l-4 border-blue-500 pl-8 py-8 px-4 rounded-r-2xl">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                The Solution: Separate “Review” from “Pay”
                            </h2>

                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                The "Approval-First" method simplifies everything by breaking the
                                process into two calm, clear steps.
                            </p>

                            <div className="space-y-10">
                                {/* Step 1 */}
                                <div>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                            1
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Send a “Brief” (The Pre-Invoice)
                                        </h3>
                                    </div>

                                    <p className="text-lg text-gray-700 leading-relaxed md:ml-14">
                                        Before creating <code className="bg-white px-2 py-1 rounded text-sm border">INV-0042.pdf</code>,
                                        send your client a “Brief”. It's a professional, simple
                                        summary of all completed work — not a legal invoice.
                                    </p>

                                    <div className="bg-white border border-blue-200 rounded-lg p-5 mt-4 md:ml-14 flex items-start gap-3">
                                        <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <p className="text-gray-700 leading-relaxed">
                                            “Hey, here’s everything we completed this month. Please
                                            review and confirm if everything looks right.”
                                        </p>
                                    </div>

                                    <p className="text-lg text-gray-700 mt-4 md:ml-14">
                                        It includes all line items and totals, but with a different
                                        tone — it’s a request for collaboration, not a payment demand.
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                            2
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Get the Client’s Approval
                                        </h3>
                                    </div>

                                    <p className="text-lg text-gray-700 leading-relaxed md:ml-14 mb-4">
                                        Your client can now review your work calmly — without the
                                        pressure of an unpaid bill hanging over them.
                                    </p>

                                    <div className="md:ml-14 space-y-4">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                            <ThumbsUp className="w-6 h-6 text-green-600 mt-1" />
                                            <p className="text-gray-800">
                                                <strong>“Looks great!”</strong> — They approve it with
                                                a single click.
                                            </p>
                                        </div>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                                            <MessageCircle className="w-6 h-6 text-yellow-600 mt-1" />
                                            <p className="text-gray-800">
                                                <strong>“Hold on…”</strong> — They request a change
                                                (like adding a missing retainer hour) before it becomes
                                                an issue.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                            3
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Send the Final Invoice
                                        </h3>
                                    </div>

                                    <p className="text-lg text-gray-700 leading-relaxed md:ml-14">
                                        Once the Brief is approved, create the final invoice. At this
                                        point, every detail is confirmed — the invoice becomes a
                                        smooth, automatic step.
                                    </p>

                                    <div className="bg-indigo-100 rounded-lg p-4 mt-4 md:ml-14 flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-indigo-700" />
                                        <p className="text-indigo-900 font-semibold">
                                            No surprises. No disputes. Just quick payments.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Summary */}
                        <section className=" rounded-2xl p-8 border border-primary">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                The Approval-First method isn’t just about organization — it’s about
                                building <strong>trust and predictability</strong> with your clients.
                                It keeps your workflow calm, your cash flow steady, and your
                                reputation professional.
                            </p>
                            <p className="text-primary font-semibold mt-6 text-center text-xl">
                                Stop the chaos. Send Briefs, not surprises.
                            </p>
                        </section>
                    </div>

                    {/* Tags */}
                    <div className="py-8 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {post.keywords.map((keyword, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="py-12 border-t border-gray-100">
                        <div className=" bg-gradient-to-r from-secondary to-secondary  text-black rounded-2xl p-10  text-center">
                            <h3 className="text-3xl font-bold mb-4">
                                Ready to Simplify Your Billing Workflow?
                            </h3>
                            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
                                Use Sheet2Bill to send pre-invoice Briefs, get approvals faster, and
                                never chase payments again.
                            </p>
                            <Button onClick={() => router.push("/login")} className="  transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
                                Try Sheet2Bill Free
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </article>

                <Footer />
            </div>
        </>
    );
};

export default BlogPost;

BlogPost.getLayout = function getLayout(page: ReactElement) {
    return page;
};
