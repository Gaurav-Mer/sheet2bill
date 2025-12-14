
import PricingSection from '@/components/pricing/PricingSection'
import { usePayment } from '@/hooks/usePayment'
import { Loader2 } from 'lucide-react'
import Script from 'next/script'

export default function PricingPage() {
    const { checkout, loading } = usePayment()

    return (
        <div className="relative">
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
