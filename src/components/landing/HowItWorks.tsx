import { Zap, CheckCircle, FileText, Clock, } from "lucide-react";

const steps = [
    {
        icon: Zap,
        title: "Create Your Brief",
        description:
            "Build a detailed project brief with line items, deliverables, and pricing. Share a secure approval link with your client.",
        time: "2 minutes",
        bgColor: "bg-blue-100",
        cardBg: "bg-white",
        mockupType: "brief"
    },
    {
        icon: CheckCircle,
        title: "Get Client Approval",
        description:
            "Client reviews and approves with one click—no login required. Track approval status and handle revisions in real-time.",
        time: "30 seconds",
        bgColor: "bg-cyan-100",
        cardBg: "bg-white",
        mockupType: "approval"
    },
    {
        icon: FileText,
        title: "Generate Invoice",
        description:
            "Convert the approved brief into a professional, branded PDF invoice instantly. Download or send directly to get paid faster.",
        time: "1 click",
        bgColor: "bg-emerald-100",
        cardBg: "bg-white",
        mockupType: "invoice"
    },
];

export function HowItWorks() {
    return (
        <section className="relative py-12 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white border-2 border-black mb-6">
                        <span className="text-sm font-semibold text-black uppercase tracking-wide">
                            Simple Process
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
                        From Brief to Payment in 3 Steps
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        Choose the workflow that fits your style: create briefs, get approvals, and generate invoices—all in one seamless platform
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 mb-20">
                    {steps.map((step) => (
                        <div key={step.title} className="group">
                            <div className={`relative h-full ${step.bgColor} rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
                                {/* Card Content */}
                                <div className="p-8 pb-0">
                                    <div className="text-center mb-8">
                                        <h3 className="text-3xl font-bold text-slate-900 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-700 leading-relaxed mb-4">
                                            {step.description}
                                        </p>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50">
                                            <Clock className="h-4 w-4 text-slate-600" />
                                            <span className="font-semibold text-slate-700 text-sm">{step.time}</span>
                                        </div>
                                    </div>

                                    {/* Mockup Preview */}
                                    <div className="relative mt-8">
                                        <div className={`${step.cardBg} rounded-t-2xl shadow-xl border border-slate-200 overflow-hidden `}>
                                            {step.mockupType === "brief" && (
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                                <Zap className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="font-bold text-slate-900">Project Brief</span>
                                                        </div>
                                                        <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Draft</span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                            <span className="text-sm text-slate-700">Homepage Design</span>
                                                            <span className="font-bold text-slate-900">$5,000</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                            <span className="text-sm text-slate-700">Backend API</span>
                                                            <span className="font-bold text-slate-900">$8,500</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                            <span className="text-sm text-slate-700">Testing & QA</span>
                                                            <span className="font-bold text-slate-900">$2,000</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {step.mockupType === "approval" && (
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                                                                <CheckCircle className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="font-bold text-slate-900">Client Review</span>
                                                        </div>
                                                        <span className="text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                                                    </div>
                                                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                                        <p className="text-sm text-slate-700 mb-3">Review project scope and approve to proceed:</p>
                                                        <div className="text-2xl font-bold text-slate-900 mb-2">Total: $15,500</div>
                                                        <p className="text-xs text-slate-600">3 deliverables • Est. 4 weeks</p>
                                                    </div>
                                                    <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
                                                        Approve Project
                                                    </button>
                                                </div>
                                            )}

                                            {step.mockupType === "invoice" && (
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                                                <FileText className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="font-bold text-slate-900">Invoice #001</span>
                                                        </div>
                                                        <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">✓ Paid</span>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 mb-3">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm text-slate-600">Amount Due</span>
                                                            <span className="text-3xl font-black text-emerald-600">$15,500</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600">Due: Dec 25, 2024</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-200 transition-colors">
                                                            Download PDF
                                                        </button>
                                                        <button className="flex-1 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                                                            Send Invoice
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="max-w-5xl mx-auto mb-20">
                    <div className="bg-white rounded-3xl border border-l-8 border-r-8  border-black relative p-10">
                        <div className="grid md:grid-cols-3 gap-10 divide-x divide-slate-200">
                            <div className="text-center md:px-6">
                                <div className="text-5xl font-black text-slate-900 mb-2">
                                    &lt;5 min
                                </div>
                                <p className="text-slate-600">Total time per invoice</p>
                            </div>
                            <div className="text-center md:px-6">
                                <div className="text-5xl font-black text-slate-900 mb-2">
                                    90%
                                </div>
                                <p className="text-slate-600">Faster than manual methods</p>
                            </div>
                            <div className="text-center md:px-6">
                                <div className="text-5xl font-black text-slate-900 mb-2">
                                    Zero
                                </div>
                                <p className="text-slate-600">Invoice errors or disputes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
            </div>
        </section>
    );
}