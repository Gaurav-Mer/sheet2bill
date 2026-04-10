
import PricingSection from '@/components/pricing/PricingSection'
import { usePayment } from '@/hooks/usePayment'
import { Loader2 } from 'lucide-react'
import Script from 'next/script'
import Head from 'next/head'

export default function PricingPage() {
    const { checkout, loading } = usePayment()

    return (
        <div className="relative">
            <Head>
                <title>Pricing — Sheet2Bill | Free & Pro Plans for Freelancers</title>
                <meta name="description" content="Sheet2Bill is free to start. Upgrade to Pro for ₹299/month to unlock unlimited invoices, custom branding, premium templates, and more. No hidden fees." />
                <meta name="keywords" content="sheet2bill pricing, freelance invoicing tool price, invoice software India, free invoice generator, pro freelancer plan" />
                <link rel="canonical" href="https://www.sheet2bill.com/pricing" />
                <meta property="og:title" content="Pricing — Sheet2Bill | Free & Pro Plans" />
                <meta property="og:description" content="Start free. Upgrade to Pro for ₹299/month and unlock unlimited invoices, custom branding, and premium templates." />
                <meta property="og:url" content="https://www.sheet2bill.com/pricing" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.sheet2bill.com/landing.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Pricing — Sheet2Bill | Free & Pro Plans" />
                <meta name="twitter:description" content="Free invoicing for freelancers. Upgrade to Pro for ₹299/month." />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Sheet2Bill Pricing",
                    "url": "https://www.sheet2bill.com/pricing",
                    "description": "Compare Sheet2Bill plans. Start free or upgrade to Pro for ₹299/month.",
                    "offers": [
                        {
                            "@type": "Offer",
                            "name": "Starter Plan",
                            "price": "0",
                            "priceCurrency": "INR",
                            "description": "Free plan — 3 briefs/month, 2 clients, basic invoicing"
                        },
                        {
                            "@type": "Offer",
                            "name": "Pro Freelancer Plan",
                            "price": "299",
                            "priceCurrency": "INR",
                            "description": "Pro plan — 200 briefs/month, 50 clients, custom branding, premium templates"
                        }
                    ]
                })}} />
            </Head>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            {/* Show a global loader if payment is initiating */}
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="font-medium text-gray-600">Starting secure payment...</p>
                    </div>
                </div>
            )}

            <PricingSection onUpgradeClick={(plan, region) => checkout(plan, region)} />
        </div>
    )
}


// ### ✅ Final Checklist

// You have now built a complete One-Time Payment system with "SaaS-style" monthly limits.

// 1.  **User clicks "Upgrade"** → `usePayment` creates an order via API.
// 2.  **Razorpay Popup opens** → User pays ₹299.
// 3.  **Payment Success** → API verifies signature.
// 4.  **Database Update** → `subscription_ends_at` extends by 30 days.
// 5.  **Hooks Update** → `useSubscription` sees the new date and returns `isPro: true`.
// 6.  **UI Unlocks** → Limits (200 briefs) are applied instantly.

// **You are ready to launch!** Start the server (`npm run dev`) and try buying a plan in "Test Mode" using Razorpay test card credentials.
