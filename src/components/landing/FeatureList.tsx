import React from 'react'
import { BarChart, CheckCheck, Clock, FileDown, FilePlus, Settings, Users, Zap, Sparkles, Shield } from 'lucide-react';

const FeatureList = () => {
    return (
        <section id="features" className="py-12 bg-[#f9efe4] relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_50%)]" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-black border-2 rounded-full mb-6">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-md font-bold text-black">Powerful Features</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Everything You Need to Bill Like a Pro
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        From client management to invoice generation, we&apos;ve built every feature you need to run your freelance billing operations smoothly and professionally.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {[
                        {
                            icon: Users,
                            title: "Smart Client Management",
                            desc: "Complete CRM with search, filtering, and full CRUD operations. Store contact details, billing history, and project notes all in one place.",
                            benefit: "Save 30 min/week",
                            color: "from-blue-500 to-cyan-500",
                            gradient: "bg-gradient-to-br from-blue-50 to-cyan-50"
                        },
                        {
                            icon: CheckCheck,
                            title: "Pre-Invoice Approval",
                            desc: "Share a secure approval link with clients before invoicing. Get sign-off on scope and pricing to eliminate disputes later.",
                            benefit: "Zero disputes",
                            color: "from-green-500 to-emerald-500",
                            gradient: "bg-gradient-to-br from-green-50 to-emerald-50"
                        },
                        {
                            icon: FilePlus,
                            title: "1-Click Invoice Creation",
                            desc: "Convert approved briefs to sequentially-numbered invoices instantly. All client data and line items auto-populate—no manual entry.",
                            benefit: "90% faster",
                            color: "from-purple-500 to-pink-500",
                            gradient: "bg-gradient-to-br from-purple-50 to-pink-50"
                        },
                        {
                            icon: Zap,
                            title: "Real-Time Status Tracking",
                            desc: "Monitor every invoice from draft to paid. Get instant visibility into what's pending, overdue, or completed with smart status labels.",
                            benefit: "Always in control",
                            color: "from-yellow-500 to-orange-500",
                            gradient: "bg-gradient-to-br from-yellow-50 to-orange-50"
                        },
                        {
                            icon: FileDown,
                            title: "Professional PDF Export",
                            desc: "Generate pixel-perfect, branded invoices with your logo and colors. Server-side rendering ensures consistent quality every time.",
                            benefit: "Look professional",
                            color: "from-red-500 to-rose-500",
                            gradient: "bg-gradient-to-br from-red-50 to-rose-50"
                        },
                        {
                            icon: BarChart,
                            title: "Revenue Dashboard",
                            desc: "See total revenue, outstanding payments, and client trends at a glance. Make informed business decisions with real-time financial insights.",
                            benefit: "Know your numbers",
                            color: "from-indigo-500 to-blue-500",
                            gradient: "bg-gradient-to-br from-indigo-50 to-blue-50"
                        },
                        {
                            icon: Settings,
                            title: "Brand Customization",
                            desc: "Upload your logo, set your brand colors, and add your business address. Every invoice reflects your professional identity.",
                            benefit: "Your brand, your way",
                            color: "from-teal-500 to-cyan-500",
                            gradient: "bg-gradient-to-br from-teal-50 to-cyan-50"
                        },
                        {
                            icon: Clock,
                            title: "Auto-Sequential Numbering",
                            desc: "Never worry about invoice numbers again. The system automatically assigns the next number in sequence for perfect bookkeeping.",
                            benefit: "Stay organized",
                            color: "from-violet-500 to-purple-500",
                            gradient: "bg-gradient-to-br from-violet-50 to-purple-50"
                        },
                        {
                            icon: Shield,
                            title: "Secure Client Portal",
                            desc: "Clients can view and approve briefs without logging in. Secure, time-stamped approval links keep everyone on the same page.",
                            benefit: "Build trust",
                            color: "from-pink-500 to-rose-500",
                            gradient: "bg-gradient-to-br from-pink-50 to-rose-50"
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white border-b-2 border-r-2 b border-black rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Gradient overlay on hover */}

                            <div className="relative p-6">
                                {/* Icon with gradient background */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`inline-flex p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>

                                    {/* Benefit badge */}
                                    <div className={`px-3 py-1 rounded-full bg-secondary  `}>
                                        <span className="text-xs font-semibold text-black">{feature.benefit}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {feature.desc}
                                </p>

                                {/* Bottom accent line */}
                                {/* <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} /> */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                {/* <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-slate-700">
                            All features included in every plan • No hidden upgrades • Cancel anytime
                        </p>
                    </div>
                </div> */}
            </div>
        </section>

    )
}

export default FeatureList