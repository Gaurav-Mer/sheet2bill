'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck, FileText, Sheet, Users, X, TrendingUp } from "lucide-react";

export function ProblemSolutionBanner() {
    return (
        <section className="relative py-12 overflow-hidden bg-white border-t border-zinc-200/60">

            {/* Minimal High-End Geometric Line Layout Grid */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.3]" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Informational Copy Engine Heading */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50">
                        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
                            Operational Friction Matrix
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 leading-[1.15]">
                        Stop juggling chaotic tools for{" "}
                        <br className="hidden sm:inline" />
                        <span className="font-serif italic text-primary">quotes &amp; invoices</span>.
                    </h2>

                    <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-zinc-500 font-normal">
                        Independent professionals burn valuable billable hours transferring data manually between separate project estimates and accounting ledgers. Sheet2Bill unifies the pipeline completely.
                    </p>
                </div>

                {/* Comparison Layout Balance Blocks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">

                    {/* THE LEGACY WAY — Flat, Muted, Inefficient State */}
                    <Card className="bg-zinc-50/50 border border-zinc-200/80 shadow-none rounded-2xl overflow-hidden flex flex-col justify-between">
                        <CardContent className="p-8 md:p-10 flex-1 flex flex-col justify-between gap-12">

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 shrink-0">
                                        <X className="h-5 w-5 text-zinc-500" strokeWidth={2} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-zinc-900 tracking-tight">The Fragmented Workflow</h3>
                                        <p className="text-xs md:text-sm text-zinc-400 font-mono uppercase tracking-wider mt-0.5">Manual Execution</p>
                                    </div>
                                </div>

                                <div className="space-y-4 relative">
                                    <div className="absolute left-[23px] top-6 bottom-6 w-px bg-zinc-200 border-l border-dashed border-zinc-300" aria-hidden="true" />
                                    {[
                                        { icon: FileText, title: 'Draft Quote in Word', sub: 'Manually alignment checking cell layout matrices.' },
                                        { icon: Users, title: 'Email & Wait Loops', sub: 'Chasing clients through manual email follow-up channels.' },
                                        { icon: Sheet, title: 'Re-type into Invoices', sub: 'Copy-pasting lines manually into traditional account frameworks.' },
                                    ].map(({ icon: Icon, title, sub }) => (
                                        <div key={title} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-zinc-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                                            <div className="h-6 w-6 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
                                                <Icon className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-base font-semibold text-zinc-800">{title}</p>
                                                <p className="text-sm text-zinc-500 leading-relaxed font-normal">{sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-200/60">
                                <p className="text-sm md:text-base font-normal text-zinc-600 flex items-center gap-2.5">
                                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-400 animate-pulse" aria-hidden="true" />
                                    Loss Indicator: ~45+ billable minutes drained per project sprint
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                    {/* THE OPTIMIZED SYSTEM WAY — Clean Studio Canvas using Brand Primary Color Accent */}
                    <Card className="bg-white border-2 border-primary shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden relative flex flex-col justify-between group">

                        {/* Premium Structural Design Ribbon */}
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-mono font-medium px-4 py-1.5 rounded-bl-lg tracking-wider uppercase">
                            Optimized Engine
                        </div>

                        <CardContent className="p-8 md:p-10 flex-1 flex flex-col justify-between gap-12">

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/10 shrink-0">
                                        <CheckCheck className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-zinc-900 tracking-tight">The Unified Pipeline</h3>
                                        <p className="text-xs md:text-sm text-primary font-mono uppercase tracking-wider mt-0.5">Automated Architecture</p>
                                    </div>
                                </div>

                                <div className="space-y-4 relative">
                                    <div className="absolute left-[23px] top-6 bottom-6 w-px bg-primary/20" aria-hidden="true" />
                                    {[
                                        { step: '1', title: 'Compile Smart Quotes', sub: 'Deploy modular dynamic rows and templates with zero friction.', badge: '2 min' },
                                        { step: '2', title: 'Instant Client Sign-off', sub: 'Secure client-side parameters validation via a singular link layer.', badge: 'Realtime' },
                                        { step: '3', title: 'Automated Billing Generation', sub: 'Platform auto-converts signed variables into active global invoices.', badge: 'Instant' },
                                    ].map(({ step, title, sub, badge }) => (
                                        <div key={step} className="flex items-start gap-4 p-5 rounded-xl bg-zinc-50/50 border border-zinc-200/80 transition-all duration-300 hover:border-primary/40 hover:bg-white">
                                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-primary/20">
                                                <span className="text-white text-xs font-mono font-bold">{step}</span>
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <p className="text-base font-semibold text-zinc-900">{title}</p>
                                                <p className="text-sm text-zinc-500 leading-relaxed font-normal">{sub}</p>
                                            </div>
                                            <span className="text-xs font-mono font-medium text-primary bg-white px-2.5 py-1 rounded border border-primary/20 shadow-none shrink-0 uppercase tracking-tight">
                                                {badge}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-dashed border-primary/30">
                                <p className="text-sm md:text-base font-medium text-primary flex items-center gap-2.5">
                                    <TrendingUp className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                                    Velocity metrics: under 5 minutes total from compilation to pipeline layout settlement
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    );
}