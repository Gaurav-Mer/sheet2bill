/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck, FileText, Sheet, Users, FileDown } from "lucide-react";

export function ProblemSolutionBanner() {
    return (
        <section className="relative py-12  overflow-hidden bg-[#f9efe4] text-black">
            {/* Soft background accent */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)]" />

            <div className="container mx-auto px-6">
                {/* Heading Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full  mb-6 bg-white border-black border-2">
                        <span className="text-sm font-bold text-black ">The Problem</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-6">
                        Stop Wasting 5+ Hours Per Week on Admin Work
                    </h2>
                    <p className="text-lg text-black leading-relaxed">
                        Freelancers lose an average of <span className="font-semibold text-primary bg-white px-4 rotate-1">$800/month</span> switching between Google Docs, spreadsheets, email chains, and invoicing tools. Sheet2Bill eliminates the chaos.
                    </p>
                </div>

                {/* Visual Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* BEFORE: The Chaos */}
                    <Card className="bg-[#d7e0cc]  border-l-4 border-black shadow-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-red-600 font-bold text-lg">✕</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Without Sheet2Bill
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-slate-200">
                                    <FileText className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Create brief in Google Docs</p>
                                        <p className="text-xs text-slate-500 mt-1">Export, format, send via email</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-slate-200">
                                    <Sheet className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Track in Excel spreadsheet</p>
                                        <p className="text-xs text-slate-500 mt-1">Manually update client info, hours, rates</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-slate-200">
                                    <Users className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Wait for email approval</p>
                                        <p className="text-xs text-slate-500 mt-1">Dig through inbox, follow up multiple times</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-slate-200">
                                    <FileDown className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Open invoicing software</p>
                                        <p className="text-xs text-slate-500 mt-1">Re-enter all data, generate PDF, send separately</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-sm font-semibold text-red-900">
                                    ⏱️ Time spent: <span className="text-red-600">45-60 minutes per project</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AFTER: The Solution */}
                    <Card className="bg-[#fde3aa] border-l-4 border-black  shadow-xl rounded-2xl overflow-hidden relative">
                        {/* Premium badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                            Recommended
                        </div>

                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CheckCheck className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    With Sheet2Bill
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-primary/20 shadow-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-primary text-xs font-bold">1</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900">Create brief in dashboard</p>
                                        <p className="text-xs text-slate-600 mt-1">Add client, scope, deliverables with smart templates</p>
                                    </div>
                                    <span className="text-xs font-medium text-primary whitespace-nowrap">2 min</span>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-primary/20 shadow-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-primary text-xs font-bold">2</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900">Share approval link</p>
                                        <p className="text-xs text-slate-600 mt-1">Client reviews & approves with one click — no login needed</p>
                                    </div>
                                    <span className="text-xs font-medium text-primary whitespace-nowrap">30 sec</span>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-primary/20 shadow-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-primary text-xs font-bold">3</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900">Generate invoice instantly</p>
                                        <p className="text-xs text-slate-600 mt-1">All data auto-filled — download PDF or send directly</p>
                                    </div>
                                    <span className="text-xs font-medium text-primary whitespace-nowrap">1 click</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-green-900">
                                            ⚡ Time spent: <span className="text-green-600">Less than 5 minutes</span>
                                        </p>
                                        <p className="text-xs text-green-700 mt-1">
                                            That's <strong>90% faster</strong> than traditional methods
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}