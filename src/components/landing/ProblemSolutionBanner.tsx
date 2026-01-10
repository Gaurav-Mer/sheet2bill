'use client'

import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck, FileText, Sheet, Users, X, TrendingUp } from "lucide-react";

export function ProblemSolutionBanner() {
    return (
        <section className="relative py-20 overflow-hidden bg-[#f9efe4] text-black">
            {/* Soft background accent */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)]" />

            <div className="container mx-auto px-6">
                {/* Heading Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white border-2 border-black shadow-sm">
                        <span className="text-sm font-bold text-black">The Workflow Problem</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black mb-6 leading-tight">
                        Stop Juggling Apps for <span className="text-primary">Quotes & Invoices</span>.
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
                        Freelancers lose hours manually copying data from **Estimates** to **Invoices**.
                        Sheet2Bill unifies your workflow so you can focus on billable work.
                    </p>
                </div>

                {/* Visual Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* BEFORE: The Chaos */}
                    <Card className="bg-[#d7e0cc]  border-2 border-transparent  shadow-sm rounded-3xl overflow-hidden transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center border border-red-200">
                                    <X className="h-6 w-6 text-red-600" strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">The Old Way</h3>
                                    <p className="text-sm text-slate-500 font-medium">Manual & Disconnected</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative">
                                {/* Dotted line connector */}
                                <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-slate-300 border-l-2 border-dotted border-slate-300 -z-10" />

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-slate-200">
                                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-300">
                                        <FileText className="h-3 w-3 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Draft Quote in Word</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Manually formatting tables</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-slate-200">
                                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-300">
                                        <Users className="h-3 w-3 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Email & Wait</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Endless follow-up threads</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-slate-200">
                                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-300">
                                        <Sheet className="h-3 w-3 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Re-type into Invoice</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Copy-pasting data again</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200/50">
                                <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    Result: 45+ mins wasted per project
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AFTER: The Solution */}
                    <Card className="bg-white border-2 border-primary shadow-xl rounded-3xl overflow-hidden relative transform lg:-translate-y-4">
                        {/* Badge */}
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                            OPTIMIZED
                        </div>

                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <CheckCheck className="h-6 w-6 text-primary" strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">The Sheet2Bill Way</h3>
                                    <p className="text-sm text-primary font-medium">Automated & Integrated</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative">
                                {/* Solid line connector */}
                                <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-primary/20 -z-10" />

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-primary/30">
                                        <span className="text-white text-[10px] font-bold">1</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">Create Estimate</p>
                                        <p className="text-xs text-slate-600 mt-0.5">Use templates & saved items</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-primary bg-white px-2 py-1 rounded-md border border-primary/20">2 min</span>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-primary/30">
                                        <span className="text-white text-[10px] font-bold">2</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">Client Approves</p>
                                        <p className="text-xs text-slate-600 mt-0.5">One click online approval</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-primary bg-white px-2 py-1 rounded-md border border-primary/20">Instant</span>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-primary/30">
                                        <span className="text-white text-[10px] font-bold">3</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">Convert to Invoice</p>
                                        <p className="text-xs text-slate-600 mt-0.5">Zero data re-entry</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-primary bg-white px-2 py-1 rounded-md border border-primary/20">Automated</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-dashed border-primary/20">
                                <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Result: 90% Faster Billing Cycle
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}