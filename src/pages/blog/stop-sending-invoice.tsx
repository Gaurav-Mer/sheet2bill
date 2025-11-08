/* eslint-disable react/no-unescaped-entities */
import React, { ReactElement } from "react";
import {
    Calendar,
    Clock,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    FileText,
} from "lucide-react";
import NonLoginNavbar from "@/components/landing/NonLoginNavbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

const BlogPost = () => {
    const post = {
        title: 'Stop Sending Invoices. Send "Briefs" Instead.',
        metaDescription:
            'Why just sending an invoice leads to payment delays. Learn how the "Approval-First" method of sending a brief for approval builds trust and gets you paid faster.',
        publishedAt: "2025-11-10",
        keywords: [
            "client invoice disputes",
            "how to prevent billing arguments",
            "pre-invoice approval",
            "freelance workflow",
        ],
        readTime: "4 min read",
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <NonLoginNavbar />

            {/* Header */}
            <header className="border-b border-gray-100 mt-16">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <Link
                        href="/blog"
                        className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </header>

            {/* Article */}
            <article className="max-w-4xl mx-auto px-6">
                {/* Article Header */}
                <div className="py-12 border-b border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        {post.title}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                        {post.metaDescription}
                    </p>
                </div>

                {/* Content */}
                <div className="py-12 space-y-12 text-gray-700 leading-relaxed text-lg">
                    {/* Opening */}
                    <section className="space-y-5">
                        <p>
                            What's the most dreaded email in a freelancer's inbox? It's not a
                            rejection. It's the reply to an invoice you just sent that starts
                            with,{" "}
                            <span className="italic text-gray-800">
                                "Hey, just a quick question about this line item..."
                            </span>
                        </p>
                        <p>
                            That "quick question" is the start of a 3-day email chain, a
                            delayed payment, and a feeling of frustration.
                        </p>
                        <p>
                            The problem isn't your invoice — it’s that it was the first time
                            your client saw the final, itemized bill. You've merged the
                            “review” step with the “pay me now” step — creating tension and
                            confusion.
                        </p>
                        <p className="text-xl font-semibold text-gray-900 mt-6">
                            There’s a better way: The Approval-First Method.
                        </p>
                    </section>

                    {/* Problem */}
                    <section className="border border-red-100 bg-red-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                The Problem: “Invoice Ambush”
                            </h2>
                        </div>
                        <p>
                            When you send an invoice directly, you’re ambushing your client
                            with a bill. You’re asking them to do two things at once:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>
                                <strong>Audit your work:</strong> “Does this look right? Is this
                                what we agreed on?”
                            </li>
                            <li>
                                <strong>Process a payment:</strong> “I need to send this to
                                accounting.”
                            </li>
                        </ul>
                        <p className="mt-4 font-medium text-gray-800">
                            If there's any question about Step 1, it blocks Step 2 — causing
                            disputes and delays.
                        </p>
                    </section>

                    {/* Solution */}
                    <section className="border border-green-100 bg-green-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                The Solution: Separate “Review” from “Pay”
                            </h2>
                        </div>
                        <p>
                            The “Approval-First” method splits the process into two clear,
                            stress-free steps.
                        </p>
                    </section>

                    {/* Step 1 */}
                    <section className="bg-blue-50 rounded-2xl p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    Send a “Brief” (The Pre-Invoice)
                                </h3>
                                <p>
                                    Before you even create{" "}
                                    <code className="bg-white px-2 py-1 rounded text-sm">
                                        INV-0042.pdf
                                    </code>
                                    , send your client a “Brief.”
                                </p>
                            </div>
                        </div>
                        <div className="md:ml-14 border border-blue-100 w-full bg-white rounded-xl p-4 md:p-6 ">
                            <div className="flex items-start gap-3 mb-3">
                                <FileText className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">What is a Brief?</p>
                                    <p>
                                        A simple, professional document (not a legal invoice)
                                        summarizing your work: “Here’s what we completed this month
                                        — does it all look correct?”
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3">
                                It lists the same line items and total but feels collaborative —
                                not confrontational.
                            </p>
                        </div>
                    </section>

                    {/* Step 2 */}
                    <section className="bg-purple-50 rounded-2xl p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 shrink-0 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                                2
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Get the Client’s Approval</h3>
                                <p>
                                    Clients can review calmly without the pressure of payment.
                                    They have two clear choices:
                                </p>
                            </div>
                        </div>
                        <div className="md:ml-14 space-y-3">
                            <div className="border border-green-100 bg-white rounded-lg p-4">
                                <p className="font-semibold text-green-700">✓ “Looks great!”</p>
                                <p>Approved with a single click.</p>
                            </div>
                            <div className="border border-yellow-100 bg-white rounded-lg p-4">
                                <p className="font-semibold text-yellow-700">⚠ “Hold on...”</p>
                                <p>
                                    They can request a correction, like “You forgot the 10-hour
                                    retainer.”
                                </p>
                            </div>
                            <p className="text-gray-900 font-medium mt-4">
                                You resolve all issues before an invoice ever exists.
                            </p>
                        </div>
                    </section>

                    {/* Step 3 */}
                    <section className="bg-green-50 rounded-2xl p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-10  shrink-0 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                                3
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    Send the Invoice (Final Bill)
                                </h3>
                                <p>
                                    After approval, send the invoice. Now it’s purely procedural.
                                    Every line item is pre-agreed, and payments arrive fast —
                                    dispute-free.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section className="rounded-2xl p-10  text-center">
                        <h3 className="text-2xl font-bold mb-3">The Bottom Line</h3>
                        <p className="text-primary font-semibold text-lg max-w-2xl mx-auto">
                            This workflow stops the chaos, builds trust, and ensures you get
                            paid faster — without awkward invoice conversations.
                        </p>
                    </section>
                </div>

                {/* CTA */}
                <div className="border-t border-gray-100 py-12 text-center">
                    <h3 className="text-2xl font-bold mb-3">
                        Ready to simplify your invoicing?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Start using the Approval-First method today and get paid faster.
                    </p>
                    <Link href="/signup">
                        <button className="inline-flex items-center gap-2 bg-gray-900 cursor-pointer text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                            Get Started <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </article>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default BlogPost;
BlogPost.getLayout = function getLayout(page: ReactElement) {
    return page;
};
