'use client'

import { useState } from 'react'
import Script from 'next/script'
import { Check, X, Zap, Shield, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { PRICING_CONFIG } from '@/lib/pricing'
import { twMerge } from 'tailwind-merge'

export default function PricingSection({ onUpgradeClick, containerClass }: { onUpgradeClick: (plan: 'monthly' | 'yearly', region: 'IN' | 'US') => void, containerClass?: string }) {
    const [isYearly, setIsYearly] = useState(false)
    const [region, setRegion] = useState<'IN' | 'US'>('IN') // Default to India
    const { plans, currency } = PRICING_CONFIG

    // Helper to calculate price based on region rate
    const getPrice = (basePrice: number) => {
        const rate = currency[region].rate
        // Round up to nearest whole number (e.g. 299 * 0.03 = 8.97 -> 9)
        return Math.ceil(basePrice * rate)
    }

    const currentSymbol = currency[region].symbol

    // Helper to render features list items
    const FeatureItem = ({ included, text, highlight = false }: { included: boolean, text: string, highlight?: boolean }) => (
        <li className="flex items-center gap-3">
            {included ? (
                <div className={cn("p-1 rounded-full", highlight ? "bg-primary/20 text-primary" : "bg-green-100 text-green-600")}>
                    <Check size={14} strokeWidth={3} />
                </div>
            ) : (
                <div className="p-1 rounded-full bg-gray-100 text-gray-400">
                    <X size={14} strokeWidth={3} />
                </div>
            )}
            <span className={cn("text-sm", included ? "text-gray-700" : "text-gray-400", highlight && "font-medium text-gray-900")}>
                {text}
            </span>
        </li>
    )

    return (
        <section className={twMerge(" bg-gradient-to-b from-white to-gray-50", containerClass)}>
            {/* Performance Optimization: 
                Load Razorpay SDK only when this component is mounted.
                'lazyOnload' ensures it doesn't block the initial UI painting.
            */}
            {/* <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            /> */}

            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-end mb-4">
                        {/* Region Toggle */}
                        <div className="inline-flex border-primary border p-1 rounded-lg">
                            <button
                                onClick={() => setRegion('IN')}
                                className={cn("px-3 py-2 text-sm font-medium rounded-md transition-all", region === 'IN' ? "bg-primary shadow-sm text-white" : "text-muted-foreground hover:text-gray-900")}
                            >
                                🇮🇳 INR
                            </button>
                            <button
                                onClick={() => setRegion('US')}
                                className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", region === 'US' ? "bg-primary shadow-sm text-white" : "text-muted-foreground hover:text-gray-900")}
                            >
                                🌎 USD
                            </button>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                        Start for free, upgrade when you land clients. No auto-debit, pay only when you need to.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-sm font-medium", !isYearly ? "text-primary" : "text-muted-foreground")}>Monthly</span>
                        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                        <span className={cn("text-sm font-medium", isYearly ? "text-primary" : "text-muted-foreground")}>
                            Yearly <span className="text-xs text-green-600 font-bold ml-1">(2 Months Free)</span>
                        </span>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* --- FREE PLAN --- */}
                    <Card className="border-border/50 shadow-sm relative overflow-hidden flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">{plans.free.name}</CardTitle>
                            <CardDescription>{plans.free.description}</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{currentSymbol}0</span>
                                <span className="text-muted-foreground"> / forever</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                {/* Limits */}
                                <FeatureItem included={true} text={`${plans.free.limits.briefs_per_month} Briefs & Invoices per month`} />
                                <FeatureItem included={true} text={`${plans.free.limits.clients_saved} Saved Clients`} />
                                <FeatureItem included={true} text={`${plans.free.limits.items_in_library} Service Items in Library`} />
                                {/* Features */}
                                {/* <FeatureItem included={true} text="Basic Public Profile" /> */}
                                <FeatureItem included={false} text="Remove 'Powered by' Branding" />
                                <FeatureItem included={true} text="Pro Public Profile (Social Links)" />
                                <FeatureItem included={false} text="Premium Invoice Styles" />
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" disabled>
                                Current Plan
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* --- PRO PLAN --- */}
                    <Card className="border-primary shadow-lg relative overflow-hidden transform md:-translate-y-4 transition-all flex flex-col">
                        {/* Popular Badge */}
                        <div className="absolute top-0 right-0">
                            <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                                RECOMMENDED
                            </div>
                        </div>

                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-xl text-primary">{plans.pro.name}</CardTitle>
                                <Zap size={18} className="text-yellow-500 fill-yellow-500" />
                            </div>
                            <CardDescription>{plans.pro.description}</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">
                                    {currentSymbol}
                                    {isYearly
                                        ? getPrice(plans.pro.price.yearly)
                                        : getPrice(plans.pro.price.monthly)
                                    }
                                </span>
                                <span className="text-muted-foreground">
                                    {isYearly ? " / year" : " / 30 days"}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                {/* High Volume Limits */}
                                <FeatureItem included={true} highlight text={`${plans.pro.limits.briefs_per_month} Briefs per month`} />
                                <FeatureItem included={true} text={`${plans.pro.limits.clients_saved} Saved Clients`} />
                                <FeatureItem included={true} text={`${plans.pro.limits.items_in_library} Service Items`} />

                                {/* Pro Features */}
                                <FeatureItem included={true} highlight text="No 'Sheet2Bill' Watermark" />
                                <FeatureItem included={true} text="All Premium Invoice Templates" />
                                <FeatureItem included={true} text="Pro Public Profile (Social Links)" />
                                <FeatureItem included={true} text="Priority Support" />
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-lg py-6 shadow-md hover:shadow-xl transition-all"
                                onClick={() => onUpgradeClick(isYearly ? 'yearly' : 'monthly', region)}
                            >
                                Upgrade to Pro
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Trust Signals */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
                    <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                        <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                            <Shield className="text-primary" size={20} />
                        </div>
                        <h3 className="font-bold text-sm">Secure Payments</h3>
                        <p className="text-xs text-gray-500 mt-1">Processed securely via Razorpay. We don&apos;t store cards.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                        <div className="mx-auto w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                            <Check className="text-green-600" size={20} />
                        </div>
                        <h3 className="font-bold text-sm">No Auto-Debit</h3>
                        <p className="text-xs text-gray-500 mt-1">Manual recharge. You are always in control.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                        <div className="mx-auto w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                            <Globe className="text-purple-600" size={20} />
                        </div>
                        <h3 className="font-bold text-sm">Global Standards</h3>
                        <p className="text-xs text-gray-500 mt-1">Invoices accepted by clients worldwide.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}