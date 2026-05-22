import React from 'react'
import { BarChart, CheckCheck, Clock, FileDown, FilePlus, Settings, Users, Zap, Sparkles, Shield } from 'lucide-react';

const features = [
    {
        icon: Users,
        title: "Smart Client Records",
        desc: "Complete, responsive registry with deep search, advanced filtering, and instant record mutations. Archive contract details, ledger paths, and project metadata in one workspace.",
        benefit: "Save 30 min/wk",
    },
    {
        icon: CheckCheck,
        title: "Pre-Billing Authorizations",
        desc: "Distribute encrypted, public approval URLs to clients before rendering final documentation. Secure digital signatures on project scopes to eliminate friction or payment delays.",
        benefit: "Zero disputes",
    },
    {
        icon: FilePlus,
        title: "Unified Invoice Compilation",
        desc: "Convert executed proposals into legally sequential, tracked invoices with a single gesture. The system dynamically maps client indices and line items—minimizing re-entry loops.",
        benefit: "90% Faster",
    },
    {
        icon: Zap,
        title: "Real-Time Tracking Logs",
        desc: "Observe transmission pathways from basic draft states directly to payment validation hooks. Stay informed on outstanding obligations via live webhook state indicators.",
        benefit: "Absolute control",
    },
    {
        icon: FileDown,
        title: "Vector PDF Exporters",
        desc: "Compile beautifully structured document deliverables optimized for localized printing. Specialized rendering pipelines prevent visual layout shifts across external clients.",
        benefit: "Branded output",
    },
    {
        icon: BarChart,
        title: "Performance Dashboards",
        desc: "Isolate total operating revenue metrics, uncleared sums, and long-term retention balances instantly. Extract high-fidelity parameters to optimize capital allocations.",
        benefit: "Live metrics",
    },
    {
        icon: Settings,
        title: "Identity Configuration",
        desc: "Deploy core layout assets, custom typographic setups, and corporate tracking addresses easily. Every outbound communication inherits your true pixel-perfect brand identity.",
        benefit: "Tailored canvas",
    },
    {
        icon: Clock,
        title: "Sequential Numeration",
        desc: "Protect financial compliance paths without manual counting sheets. The system securely calculates, matches, and appends unique regulatory numbers dynamically.",
        benefit: "Auto-sync",
    },
    {
        icon: Shield,
        title: "Protected Client Portals",
        desc: "Enable external partners to process parameters, request adjustments, and trigger settlement actions directly without entering complex authentication workflows.",
        benefit: "Secure links",
    }
];

export function FeatureList() {
    return (
        <section id="features" className="relative py-12 overflow-hidden bg-white border-t border-zinc-200/60">

            {/* Minimal High-End Geometric Line Layout Grid */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.3]" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header Copy Stack */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">Powerful Features</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 leading-[1.15]">
                        Everything you need to bill <br className="hidden sm:inline" />
                        like a <span className="font-serif italic text-primary">global operation</span>.
                    </h2>
                    <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-zinc-500 font-normal">
                        From modern secure portal channels to automated ledger numbering, run your independent financial pipeline flawlessly.
                    </p>
                </div>

                {/* Feature Bento Grid Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-zinc-200/80 bg-zinc-50/40 transition-all duration-300 hover:bg-white hover:border-primary/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.03)]"
                        >
                            {/* Inner ambient illumination element on card hover */}
                            <div aria-hidden="true" className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.01),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="relative z-10 flex flex-col h-full justify-between space-y-8">

                                {/* Feature Icon + Tagline row header */}
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex p-3 bg-white border border-zinc-200 rounded-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:border-primary">
                                        <feature.icon className="h-5 w-5 text-zinc-700 transition-colors duration-300 group-hover:text-white" />
                                    </div>

                                    <div className="px-3 py-1 rounded-md bg-zinc-100/80 border border-zinc-200/60 shadow-none">
                                        <span className="text-xs font-mono font-medium text-zinc-600 uppercase tracking-tight">{feature.benefit}</span>
                                    </div>
                                </div>

                                {/* Typography Information Fields */}
                                <div className="space-y-2">
                                    <h3 className="text-lg md:text-xl font-semibold tracking-tight text-zinc-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-normal transition-colors duration-300 group-hover:text-zinc-600">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clean Global Feature Guarantee Footprint */}
                <div className="mt-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-zinc-50 border border-zinc-200/80 rounded-full shadow-sm">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <p className="text-sm md:text-base font-normal text-zinc-600 tracking-normal">
                            All core modules deployment ready across every account layer. <span className="font-semibold text-zinc-900">No auxiliary charges.</span>
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default FeatureList;