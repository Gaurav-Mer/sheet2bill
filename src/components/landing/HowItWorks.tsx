import { Zap, CheckCircle, FileText, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

const steps = [
    {
        icon: Zap,
        title: 'Create Your Brief',
        description: 'Build a detailed project brief with line items, deliverables, and pricing. Share a secure approval link with your client.',
        time: '2 minutes',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50'
    },
    {
        icon: CheckCircle,
        title: 'Get Client Approval',
        description: 'Client reviews and approves with one click—no login required. Track approval status and handle revisions in real-time.',
        time: '30 seconds',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50'
    },
    {
        icon: FileText,
        title: 'Generate Invoice',
        description: 'Convert the approved brief into a professional, branded PDF invoice instantly. Download or send directly to get paid faster.',
        time: '1 click',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'from-purple-50 to-pink-50'
    },
];

export function HowItWorks() {
    return (
        <section className="py-12 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)]" />

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="text-md font-bold text-primary">Simple Process</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        From Brief to Payment in 3 Easy Steps
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        No complex setup. No learning curve. Just a straightforward workflow that saves you hours every week.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connector arrows for desktop */}
                        <div className="hidden md:flex absolute top-24 left-0 w-full items-center justify-between px-[20%] -z-10">
                            <ArrowRight className="h-8 w-8 text-primary/30" />
                            <ArrowRight className="h-8 w-8 text-primary/30" />
                        </div>

                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className="relative group"
                            >
                                {/* Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-8 h-full hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                                    {/* Icon with gradient */}
                                    <div className="relative mb-6">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 mx-auto`}>
                                            <step.icon className="h-10 w-10 text-white" />
                                        </div>

                                        {/* Step number badge */}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-white text-sm font-bold">{index + 1}</span>
                                        </div>
                                    </div>

                                    {/* Time estimate */}
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-semibold text-primary">{step.time}</span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed text-center">
                                        {step.description}
                                    </p>

                                    {/* Bottom gradient accent */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom section with stats */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 border-2 border-primary/20 rounded-2xl p-8 md:p-12">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    &lt;5 min
                                </div>
                                <p className="text-sm text-slate-600">
                                    Total time per invoice
                                </p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    90%
                                </div>
                                <p className="text-sm text-slate-600">
                                    Faster than traditional methods
                                </p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    Zero
                                </div>
                                <p className="text-sm text-slate-600">
                                    Invoice disputes or errors
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link href={"/signup"}>
                        <button className="group px-10 cursor-pointer py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full font-bold text-base shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 inline-flex items-center gap-2">
                            Get Started Free
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button></Link>
                    {/* <p className="text-sm text-slate-500 mt-4">
                        No credit card required • Set up in under 2 minutes
                    </p> */}
                </div>
            </div>
        </section>
    );
}