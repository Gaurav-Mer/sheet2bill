import React, { ReactElement, useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import { Footer } from '@/components/landing/Footer';
import { useRouter } from 'next/navigation';

const BlogListingPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const router = useRouter()
    const categories = ['All', 'Business', 'Freelancing', 'Finance'];

    const blogPosts = [
        {
            id: 1,
            title: 'The 5 Essentials for a Professional Freelance Invoice',
            excerpt: 'Learn the 5 essential components that ensure you look professional and get paid faster.',
            category: 'Freelancing',
            date: '2025-11-08',
            readTime: '5 min read',
            featured: true,
            link: "freelance-invoice-essentials"
        },
        {
            id: 2,
            title: 'Stop Sending Invoices. Send "Briefs" Instead.',
            excerpt: 'Why just sending an invoice leads to payment delays. Learn how the "Approval-First" method of sending a brief for approval builds trust and gets you paid faster.',
            category: 'Business',
            date: "2025-11-10",
            readTime: '4 min read',
            featured: true,
            link: "stop-sending-invoice"
        },
        {
            id: 3,
            title: '3 Ways Your Billing Spreadsheet is Costing You Money',
            excerpt: 'Still using Excel or Google Sheets for invoicing? Discover the 3 hidden costs and why upgrading to a professional billing hub is a smarter, more profitable move.',
            category: 'Finance',
            date: '2025-11-10',
            readTime: '6 min read',
            featured: false,
            link: "ways-to-bill"
        },

    ];

    const filteredPosts = selectedCategory === 'All'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    return (
        <>
            <div className="min-h-dvh  bg-white">
                <NonLoginNavbar />

                {/* Hero */}
                <div className="border-b border-gray-100 mt-16">
                    <div className="max-w-full px-auto px-12 py-24 bg-primary/5">
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">
                            Insights for Freelancers
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            Practical guides and expert tips to help you grow your freelance business.
                        </p>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="border-b border-gray-100">
                    <div className="max-w-full  px-12 py-6">
                        <div className="flex gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Blog Posts */}
                <div className="max-w-full  p-12">
                    <div className="space-y-12">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="group border-b border-black pb-12 last:border-0"
                                onClick={() => router.push(`/blog/${post?.link}`)}
                            >
                                <div className="flex items-start gap-3 text-sm text-gray-500 mb-4">
                                    <span className="text-gray-900 font-medium">{post.category}</span>
                                    <span>·</span>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <span>·</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>

                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <button className="inline-flex cursor-pointer items-center gap-2 text-gray-900 font-medium group-hover:gap-3 transition-all">
                                    Read article
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

export default BlogListingPage;
BlogListingPage.getLayout = function getLayout(page: ReactElement) { return page; };