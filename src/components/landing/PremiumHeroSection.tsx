import {
    ArrowRight,
    Check,
    CheckCircle,
    FileText,
    Receipt,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────
// Reusable Premium Minimal Cards
// ─────────────────────────────────────────────────────────────

function BriefCard() {
    return (
        <div className="w-full rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200">
                        <FileText className="h-3.5 w-3.5 text-zinc-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-primary">Project Brief</p>
                        <p className="text-[11px] text-zinc-400">Proposal & Deliverables</p>
                    </div>
                </div>
                <span className="rounded-md bg-zinc-50 border border-zinc-200/60 px-2 py-0.5 text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                    Draft
                </span>
            </div>

            <div className="space-y-2.5">
                {[
                    ["UI/UX Strategy", "₹50,000"],
                    ["Core Engine API", "₹85,000"],
                    ["Systems Testing", "₹20,000"],
                ].map(([label, amount]) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">{label}</span>
                        <span className="font-medium text-primary">{amount}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                <span className="text-xs text-zinc-400">Project Total</span>
                <span className="text-sm font-semibold text-primary">₹1,55,000</span>
            </div>
        </div>
    );
}

function ApprovalCard() {
    return (
        <div className="w-full rounded-2xl border border-primary bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-primary">Client Sign-off</p>
                    <p className="text-[11px] text-zinc-400">Approved instantly via secure link</p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
                <p className="text-[11px] text-zinc-400">Contract Value</p>
                <h3 className="text-2xl font-semibold tracking-tight text-primary mt-0.5">₹1,55,000</h3>
                <p className="mt-1.5 text-xs text-zinc-400 font-mono">3 DELIVERABLES · 4 WEEK SPRINT</p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-medium text-white shadow-sm">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                Approved by Client
            </div>
        </div>
    );
}

function InvoiceCard() {
    return (
        <div className="w-full rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200/60">
                        <Receipt className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-primary">Invoice #042</p>
                        <p className="text-[11px] text-emerald-600 font-medium">Clear balance settled</p>
                    </div>
                </div>
                <span className="rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 uppercase tracking-wider">
                    Paid
                </span>
            </div>

            <div className="mb-4">
                <p className="text-[11px] text-zinc-400">Settled Amount</p>
                <h3 className="text-2xl font-semibold tracking-tight text-primary mt-0.5">₹1,55,000</h3>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-mono">25.12.2025</span>
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-medium text-zinc-600">
                    UPI Instant ↗
                </span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Premium Hero Section Component Implementation
// ─────────────────────────────────────────────────────────────

export function PremiumHeroSection() {
    return (
        <section className="group/hero relative overflow-hidden bg-white min-h-[92vh] flex items-center border-b border-zinc-200/50">

            {/* Editorial Grid Mesh Layout System */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-[0.35]" />
            <div aria-hidden="true" className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-zinc-100/60 blur-[120px] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full py-20 lg:py-0">
                <div className="grid items-center gap-16 lg:grid-cols-12">

                    {/* Left Typographic Copy Engine */}
                    <div className="max-w-xl lg:col-span-6 z-10 space-y-6">

                        {/* Status Label Pill Accent */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-mono tracking-wider text-zinc-600 uppercase">
                                Optimized for modern operators
                            </span>
                        </div>

                        {/* Title Copy Core */}
                        <h1 className="text-4xl font-normal text-primary sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
                            Create invoices.
                            <br />
                            Get approvals.
                            <br />
                            <span className="font-serif italic text-zinc-500">Get paid faster.</span>
                        </h1>

                        {/* Description Context */}
                        <p className="max-w-md text-sm leading-relaxed text-zinc-500">
                            Build clean scopes of work, capture seamless digital client signatures,
                            and trigger instant payment processing workflows without dropping back into
                            messy tracking sheets or custom manual PDF layout builds.
                        </p>

                        {/* Interactive UI Trigger Anchors */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2">
                            <Link href="/try">
                                <Button
                                    size="lg"
                                    className="h-10 rounded-lg bg-primary px-6 text-xs font-medium text-white hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-1.5"
                                >
                                    Create Free Invoice
                                    <ArrowRight className="h-3.5 w-3.5 opacity-80" />
                                </Button>
                            </Link>

                            <a
                                href="#how-it-works"
                                className="text-xs font-medium text-zinc-500 transition-colors hover:text-primary px-3 py-2 underline-offset-4 hover:underline"
                            >
                                Architecture overview →
                            </a>
                        </div>

                        {/* Value Metric Footnotes */}
                        <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-zinc-200/60 pt-6">
                            {[
                                ["Instant Setup", "No credit card required"],
                                ["GST Compliant", "Minimal architecture"],
                                ["Free Tier", "Forever available"],
                            ].map(([title, subtitle]) => (
                                <div key={title} className="space-y-0.5">
                                    <p className="text-xs font-medium text-primary">{title}</p>
                                    <p className="text-[11px] text-zinc-400 tracking-normal">{subtitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Canvas: Floating Architecture Fluid Interactions */}
                    <div className="relative hidden lg:flex items-center justify-center lg:col-span-6 h-[520px]">
                        <div className="relative w-full max-w-[360px]">

                            {/* 1. BRIEF CARD (Glides Left & Shifts Angle) */}
                            <div className="absolute inset-0 z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform scale-95 translate-x-[-20px] translate-y-[-15px] -rotate-1 group-hover/hero:translate-x-[-125px] group-hover/hero:translate-y-[-45px] group-hover/hero:-rotate-4 group-hover/hero:scale-100 [@media(hover:none)]:animate-[slideLeft_auto_linear_both] [animation-timeline:scroll()] [animation-range:0vh_50vh]">
                                <BriefCard />
                            </div>

                            {/* 2. APPROVAL CARD (Anchor Center Focus Card) */}
                            <div className="relative z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform scale-100 group-hover/hero:scale-[1.03] group-hover/hero:shadow-[0_40px_80px_rgba(0,0,0,0.08)] [@media(hover:none)]:animate-[scaleUp_auto_linear_both] [animation-timeline:scroll()] [animation-range:0vh_50vh]">
                                <ApprovalCard />
                            </div>

                            {/* 3. INVOICE CARD (Glides Right & Shifts Angle) */}
                            <div className="absolute inset-0 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform scale-95 translate-x-[20px] translate-y-[15px] rotate-1 group-hover/hero:translate-x-[125px] group-hover/hero:translate-y-[50px] group-hover/hero:rotate-4 group-hover/hero:scale-100 [@media(hover:none)]:animate-[slideRight_auto_linear_both] [animation-timeline:scroll()] [animation-range:0vh_50vh]">
                                <InvoiceCard />
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Native Clean CSS Viewport Scroll Intersection Engine */}
            <style jsx global>{`
                @keyframes slideLeft {
                    to {
                        transform: translateX(-125px) translateY(-45px) rotate(-4deg) scale(1);
                    }
                }
                @keyframes slideRight {
                    to {
                        transform: translateX(125px) translateY(50px) rotate(4deg) scale(1);
                    }
                }
                @keyframes scaleUp {
                    to {
                        transform: scale(1.03);
                    }
                }
            `}</style>
        </section>
    );
}