/* eslint-disable react/no-unescaped-entities */
import React, { ReactElement } from 'react';
import { Calendar, Clock, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const BlogPost = () => {
    const post = {
        title: 'The 5 Essentials for a Professional Freelance Invoice',
        metaDescription: 'What should you include on a freelance invoice? Learn the 5 essential components that ensure you look professional and get paid faster.',
        publishedAt: '2025-11-08',
        keywords: ['freelance invoice template', 'how to make an invoice', 'what to include on an invoice'],
        author: {
            name: 'Your Name',
            avatar: 'https://ui-avatars.com/api/?name=Your+Name&background=3b82f6&color=fff'
        },
        readTime: '5 min read'
    };

    return (
        <>
            <NonLoginNavbar />
            <div className="min-h-dvh bg-white mt-16">
                {/* Header */}
                <header className="border-b border-gray-100 mt-16">
                    <div className="max-w-4xl mx-auto px-6 py-5">
                        <a
                            href="/blog"
                            className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                        >
                            ← Back to Blog
                        </a>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 text-black">
                    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                        <div className="flex flex-wrap gap-3 mb-6">
                            {post.keywords.map((keyword, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    <Tag className="w-3.5 h-3.5" />
                                    {keyword}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-black mb-8 leading-relaxed">
                            {post.metaDescription}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-black">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-8">
                    <article className="bg-white rounded-2xl  p-8 md:p-0" >
                        {/* Introduction */}
                        <div className="prose prose-lg max-w-none mb-12">
                            <p className="text-xl text-gray-700 leading-relaxed">
                                We've all been there. You've just finished a big project for a client. You're exhausted, but excited to get paid. You open up a blank Google Doc or spreadsheet and just... stare at it.
                            </p>
                            <p className="text-xl text-gray-700 leading-relaxed font-semibold mt-6">
                                What do you even put on a professional invoice?
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mt-4">
                                Sending an invoice that's just a simple text email with your bank details might feel fast, but it looks unprofessional and can lead to confusion. A great invoice isn't just a request for money; it's a final, branded piece of communication that builds trust.
                            </p>
                            <p className="text-lg text-gray-800 font-semibold mt-8">
                                Here are the 5 essential things every freelance invoice must have.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div className="mb-20 border-l-4 border-blue-500 pl-6 py-2 ">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                                    Clear "From" and "To" Information
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">
                                This sounds basic, but it's the most critical part for legal and accounting purposes.
                            </p>
                            <div className="space-y-4 ml-16">
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <p className="font-semibold text-gray-900 mb-2">You (The "From"):</p>
                                    <p className="text-gray-700">Your full name or company name, your full address, your email, and your phone number.</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <p className="font-semibold text-gray-900 mb-2">Your Client (The "To"):</p>
                                    <p className="text-gray-700">Your client's full company name and the name of your contact person, and their official business address.</p>
                                </div>
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                                    <p className="font-semibold text-amber-900 mb-1">💡 Pro-Tip:</p>
                                    <p className="text-amber-800">Don't make your client hunt for this. The "From" and "To" sections should be at the very top and easy to read.</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="mb-20 border-l-4 border-indigo-500 pl-6 py-2 ">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                                    A Unique Invoice Number & Key Dates
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">
                                Never, ever send an invoice with a title like <code className="bg-gray-200 px-2 py-1 rounded text-red-600">invoice_final.pdf</code>. This is a recipe for chaos in your client's accounting department (and your own).
                            </p>
                            <div className="space-y-4 ml-16">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Invoice Number:</p>
                                        <p className="text-gray-700">Every invoice needs a unique ID. A simple sequential system like INV-0001, INV-0002 is perfect. This is your primary reference number for any future communication.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Issue Date:</p>
                                        <p className="text-gray-700">The date you are sending the invoice.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Due Date:</p>
                                        <p className="text-gray-700">The date the payment is due. This is your most important call to action! Standard terms are "Net 15" (15 days) or "Net 30" (30 days).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="mb-20 border-l-4 border-purple-500 pl-6 py-2 ">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    3
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                                    A Detailed Breakdown of Services
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">
                                Don't just write "Marketing Services... ₹50,000." This is a huge red flag for clients. You must break down your work into clear, understandable line items.
                            </p>
                            <div className="ml-16">
                                <p className="font-semibold text-gray-900 mb-3">A good line item includes:</p>
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-4 font-mono text-sm">
                                    <div className="grid grid-cols-4 gap-4 mb-2 font-bold text-gray-700">
                                        <div className="col-span-2">Description</div>
                                        <div>Quantity</div>
                                        <div>Unit Price</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 text-gray-600">
                                        <div className="col-span-2">Monthly SEO Services - October</div>
                                        <div>1</div>
                                        <div>₹50,000</div>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-3">If you charge hourly, this is even more important:</p>
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 font-mono text-sm">
                                    <div className="grid grid-cols-4 gap-4 mb-2 font-bold text-gray-700">
                                        <div className="col-span-2">Description</div>
                                        <div>Quantity</div>
                                        <div>Unit Price</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 text-gray-600">
                                        <div className="col-span-2">Website Revisions - Homepage</div>
                                        <div>5 (hours)</div>
                                        <div>₹2,000</div>
                                    </div>
                                </div>
                                <p className="text-gray-700 mt-4 italic">This transparency builds trust and answers your client's questions before they even have to ask.</p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="mb-20 border-l-4 border-green-500 pl-6 py-2 ">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    4
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                                    A Clear Total with Subtotals and Taxes
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">
                                This is the money part. Make it impossible to misread. Your invoice should have a clean breakdown at the bottom:
                            </p>
                            <div className="ml-16 bg-white border-2 border-green-200 rounded-lg p-6 space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-semibold">Subtotal:</span>
                                    <span>The total for all your line items.</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-semibold">Tax:</span>
                                    <span>If you charge GST/VAT, show it as a separate line item (e.g., "GST (18%)").</span>
                                </div>
                                <div className="border-t-2 border-green-300 pt-3 flex justify-between text-gray-900 text-lg">
                                    <span className="font-bold">Total:</span>
                                    <span className="font-bold">The final, bold, unmissable amount due.</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 5 */}
                        <div className="mb-20 border-l-4 border-pink-500 pl-6 py-2">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    5
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                                    Clear Payment Terms & Instructions
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">
                                You've done the work, you've shown the math. Now, tell your client exactly how to pay you. Don't make them email you to ask for your bank details.
                            </p>
                            <div className="ml-16">
                                <p className="font-semibold text-gray-900 mb-3">Include a section at the bottom for:</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <ArrowRight className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-semibold text-gray-900">How to Pay:</p>
                                            <p className="text-gray-700">Your bank account number, IFSC code, and bank name.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <ArrowRight className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Your Thank You Note:</p>
                                            <p className="text-gray-700">A simple "Thank you for your business!" is a professional touch.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-16 bg-gradient-to-r from-secondary to-secondary rounded-2xl p-8 md:p-12 text-black text-center">
                            <h3 className="text-3xl font-bold mb-4">Ready to Create Professional Invoices?</h3>
                            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
                                Start getting paid faster with our free invoice template designed specifically for freelancers.
                            </p>
                            <Link href={"/login"}><Button className="transition-all transform hover:scale-105 shadow-lg">
                                Get Started
                            </Button></Link>
                        </div>
                    </article>

                    {/* Share Section */}
                    <div className="mt-8 bg-white rounded-xl shadow p-6 text-center">
                        <p className="text-gray-600 mb-4">Found this helpful? Share it with other freelancers!</p>
                        <div className="flex justify-center gap-4">
                            <button className="px-6 py-2 bg-primary text-white rounded-lg  transition-colors">
                                Share on Twitter
                            </button>
                            <button className="px-6 py-2 bg-primary text-white rounded-lg  transition-colors">
                                Share on LinkedIn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogPost;
BlogPost.getLayout = function getLayout(page: ReactElement) { return page; };