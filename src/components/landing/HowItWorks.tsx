import { Zap, CheckCircle, FileText, Clock } from "lucide-react";

const steps = [
    {
        icon: Zap,
        title: "Create Your Brief",
        description:
            "Build a comprehensive project brief with structured line items, milestones, and strategic pricing. Distribute a protected portal link directly to your client.",
        time: "2 minutes",
        mockupType: "brief",
    },
    {
        icon: CheckCircle,
        title: "Get Client Approval",
        description:
            "Clients verify parameters and sign off with a single click—no authentication wall required. Track absolute status logs and adjustments in real-time.",
        time: "30 seconds",
        mockupType: "approval",
    },
    {
        icon: FileText,
        title: "Generate Invoice",
        description:
            "Convert executing briefs directly into beautifully formatted, professional invoices instantly. Export or schedule payments directly to clear your balances.",
        time: "1 click",
        mockupType: "invoice",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="relative py-12 overflow-hidden bg-white border-t border-zinc-200/60">

            {/* Minimal High-End Geometric Line Layout Grid */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.3]" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Informational Copy Engine Heading */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50">
                        <span className="text-sm font-mono tracking-wider text-zinc-500 uppercase">
                            Simple Process
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 leading-[1.15]">
                        From agreement to asset settlement <br className="hidden sm:inline" /> in three <span className="font-serif italic text-primary">elegant actions</span>.
                    </h2>
                    <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-zinc-500 font-normal">
                        Unify agreements, authentication pathways, and invoicing templates directly within a single operational pipeline.
                    </p>
                </div>

                {/* Steps Cards Pipeline Layout Matrix */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {steps.map((step) => (
                        <div key={step.title} className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-8 transition-all duration-300 hover:bg-white hover:border-primary/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.03)]">

                            <div>
                                {/* Step Meta Layout Row */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/10 transition-transform duration-300 group-hover:scale-105">
                                        <step.icon className="w-5 h-5 stroke-[2]" aria-hidden="true" />
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-zinc-200 shadow-none">
                                        <Clock className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                                        <span className="text-sm font-semibold text-zinc-700 font-mono">{step.time}</span>
                                    </div>
                                </div>

                                {/* Typography Content Blocks */}
                                <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-3">{step.title}</h3>
                                <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-normal mb-8">{step.description}</p>
                            </div>

                            {/* Live Application Canvas Viewports */}
                            <div className="relative mt-auto pt-5 overflow-hidden rounded-t-xl border border-zinc-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all duration-300 group-hover:border-zinc-300 group-hover:shadow-sm">

                                {step.mockupType === "brief" && (
                                    <div className="p-5 select-none">
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                                    <Zap className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                                                </div>
                                                <span className="font-semibold text-zinc-900 text-sm tracking-tight">Project Proposal</span>
                                            </div>
                                            <span className="text-xs font-medium tracking-wide uppercase px-2.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded">Draft</span>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                ['Strategy & Discovery', '$2,400'],
                                                ['Prototype Design', '$4,800'],
                                                ['API Infrastructure', '$6,500'],
                                            ].map(([label, amount]) => (
                                                <div key={label} className="flex justify-between items-center p-3 bg-zinc-50/50 border border-zinc-200/60 rounded-lg">
                                                    <span className="text-sm text-zinc-500 font-normal">{label}</span>
                                                    <span className="text-sm font-semibold text-zinc-900 font-mono">{amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step.mockupType === "approval" && (
                                    <div className="p-5 select-none">
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center">
                                                    <CheckCircle className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                                                </div>
                                                <span className="font-semibold text-zinc-900 text-sm tracking-tight">Client Review</span>
                                            </div>
                                            <span className="text-xs font-semibold tracking-wide uppercase px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/50 rounded">Pending</span>
                                        </div>
                                        <div className="bg-zinc-50/50 rounded-lg p-4 mb-4 border border-zinc-200/60">
                                            <p className="text-xs text-zinc-400 font-normal mb-1">Verify summary value to authorize:</p>
                                            <div className="text-2xl font-semibold text-zinc-900 tracking-tight">$13,700</div>
                                            <p className="text-xs text-zinc-400 mt-1 font-mono">3 MILESTONES · TERM 4 WEEKS</p>
                                        </div>
                                        <div className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg text-center shadow-sm">
                                            Execute Sign-off
                                        </div>
                                    </div>
                                )}

                                {step.mockupType === "invoice" && (
                                    <div className="p-5 select-none">
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-center">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                                </div>
                                                <span className="font-semibold text-zinc-900 text-sm tracking-tight">Invoice #INV-001</span>
                                            </div>
                                            <span className="text-xs font-semibold tracking-wide uppercase px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded">Paid</span>
                                        </div>
                                        <div className="bg-zinc-50/50 border border-zinc-200/60 rounded-lg p-4 mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500 font-normal">Funds Disbursed</span>
                                                <span className="text-xl font-semibold text-primary tracking-tight font-mono">$13,700</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 py-2 bg-zinc-50 text-zinc-600 border border-zinc-200 font-medium rounded-lg text-xs text-center">
                                                Receipt
                                            </div>
                                            <div className="flex-1 py-2 bg-primary text-white font-medium rounded-lg text-xs text-center shadow-sm">
                                                Stripe Log
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>

                {/* Performance Analytics Metric Panel Rows */}
                <div className="max-w-4xl mx-auto">
                    <div className="group relative bg-white border border-zinc-200/80 rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-200/60">
                            {[
                                { val: '< 5 min', label: 'Average full lifecycle pipeline compilation layout.' },
                                { val: '1 Click', label: 'Instant asset conversion from proposal parameters straight to ledger.' },
                                { val: '0 Sec', label: 'Manual data extraction processing or transfer workflow errors.' },
                            ].map(({ val, label }, i) => (
                                <div
                                    key={i}
                                    className={`text-center flex flex-col items-center justify-center ${i > 0 ? 'pt-6 md:pt-0 md:px-8' : 'md:px-8'
                                        }`}
                                >
                                    <div className="text-3xl font-semibold tracking-tight text-primary font-mono">
                                        {val}
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-zinc-500 max-w-[24px] min-w-[220px]">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}