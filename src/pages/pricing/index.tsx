/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GetServerSidePropsContext } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
// import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

// --- THE DATA STRUCTURE: Your Single Source of Truth ---
// in pages/pricing.tsx

// in pages/pricing.tsx

const ALL_FEATURES = {
    clients: "Manage Clients",
    briefsInvoices: "Briefs & Invoices / month",
    pdf_downloads: "Premium PDF Downloads",
    custom_branding: "Custom Branding (Logo & Color)",
    premium_templates: "Choice of Premium Templates",
    csv_import: "CSV Data Import",
    reports: "Analytics & Reports",
    team_members: "Team Members",
    priority_support: "Priority Support",
};

const PLANS = [
    {
        name: 'Free',
        price: {
            inr: { monthly: '₹0' },
            usd: { monthly: '$0' }
        },
        description: 'For individuals and hobby projects just getting started.',
        cta: 'Current Plan',
        features: [
            { text: `5 ${ALL_FEATURES.clients}`, included: true },
            { text: `10 ${ALL_FEATURES.briefsInvoices}`, included: true },
            { text: ALL_FEATURES.pdf_downloads, included: true },
            { text: ALL_FEATURES.custom_branding, included: false },
            { text: ALL_FEATURES.premium_templates, included: false },
            { text: ALL_FEATURES.csv_import, included: false, isComingSoon: false },
        ],
        isPopular: false,
    },
    {
        name: 'Starter',
        price: {
            // IMPORTANT: Create these new Price IDs in your Stripe Dashboard
            inr: { monthly: '₹499', annually: '₹4,990', monthlyPriceId: 'price_YOUR_INR_STARTER_MONTHLY', annuallyPriceId: 'price_YOUR_INR_STARTER_ANNUALLY' },
            usd: { monthly: '$8', annually: '$80', monthlyPriceId: 'price_YOUR_USD_STARTER_MONTHLY', annuallyPriceId: 'price_YOUR_USD_STARTER_ANNUALLY' }
        },
        description: 'For serious freelancers with a growing client base.',
        cta: 'Upgrade to Starter',
        features: [
            { text: `50 ${ALL_FEATURES.clients}`, included: true },
            { text: `200 ${ALL_FEATURES.briefsInvoices}`, included: true },
            { text: ALL_FEATURES.pdf_downloads, included: true },
            { text: ALL_FEATURES.custom_branding, included: true },
            { text: ALL_FEATURES.premium_templates, included: false },
            { text: ALL_FEATURES.csv_import, included: false },
        ],
        isPopular: true, // This is now the most popular plan
    },
    {
        name: 'Pro',
        price: {
            inr: { monthly: '₹1299', annually: '₹12,990', monthlyPriceId: 'price_YOUR_INR_PRO_MONTHLY', annuallyPriceId: 'price_YOUR_INR_PRO_ANNUALLY' },
            usd: { monthly: '$19', annually: '$190', monthlyPriceId: 'price_YOUR_USD_PRO_MONTHLY', annuallyPriceId: 'price_YOUR_USD_PRO_ANNUALLY' }
        },
        description: 'For power users and businesses who need unlimited access.',
        cta: 'Upgrade to Pro',
        features: [
            { text: 'Unlimited Clients', included: true },
            { text: 'Unlimited Briefs & Invoices', included: true },
            { text: ALL_FEATURES.pdf_downloads, included: true },
            { text: ALL_FEATURES.custom_branding, included: true },
            { text: ALL_FEATURES.premium_templates, included: true },
            { text: ALL_FEATURES.csv_import, included: true, isComingSoon: true },
        ],
        isPopular: false,
    },
];
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const stripePromise = ""
export default function PricingPage({ currency }: { currency: 'inr' | 'usd' }) {
    const [isAnnual, setIsAnnual] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgradeClick = async () => {
        setIsLoading(true);
        try {
            const proPlan = PLANS.find(p => p.name === 'Pro');
            if (!proPlan) throw new Error("Pro plan not found.");

            // Select the correct price ID based on currency and billing cycle
            const priceId = isAnnual
                ? proPlan.price[currency].annuallyPriceId
                : proPlan.price[currency].monthlyPriceId;

            if (!priceId) throw new Error("Price ID not configured.");

            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });

            if (!response.ok) throw new Error("Could not create checkout session.");

            const { sessionId } = await response.json();
            const stripe = await stripePromise;
            if (stripe) {
                // await stripe.redirectToCheckout({ sessionId });
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-10 max-w-6xl">
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple Pricing for Every Business</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Start for free and scale as you grow. No hidden fees.</p>
                <div className="flex items-center justify-center space-x-2 mt-8">
                    <Label htmlFor="billing-cycle">Monthly</Label>
                    <Switch id="billing-cycle" checked={isAnnual} onCheckedChange={setIsAnnual} />
                    <Label htmlFor="billing-cycle">Annually <span className="text-green-600 font-semibold">(Save 15%)</span></Label>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start mx-auto ">
                {PLANS.map((plan, index) => {
                    const price = isAnnual && plan.price[currency]?.annually
                        ? plan.price[currency].annually
                        : plan.price[currency].monthly;

                    return (
                        <Card
                            key={plan.name}
                            className={`animate-fade-in-up flex flex-col h-full ${plan.isPopular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-6">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{price}</span>
                                    {price !== 'Contact Us' && price !== '₹0' && price !== '$0' && <span className="text-muted-foreground ml-2">/ {isAnnual ? 'year' : 'month'}</span>}
                                </div>
                                <ul className="space-y-3">
                                    {plan.features.map(feature => (
                                        <li key={feature.text} className={`flex items-start gap-3 ${!feature.included ? 'text-muted-foreground line-through' : ''}`}>
                                            {feature.included
                                                ? <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                                                : <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-1" />
                                            }
                                            <span>{feature.text}</span>
                                            {feature?.isComingSoon && (
                                                <span className="ml-2 text-xs font-semibold bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </li>
                                    ))}

                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full h-11"
                                    variant={plan.isPopular ? 'default' : 'outline'}
                                    onClick={plan.name === 'Pro' ? handleUpgradeClick : undefined}
                                    disabled={isLoading && plan.name === 'Pro'}
                                >
                                    {isLoading && plan.name === 'Pro' ? 'Redirecting...' : plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const country = (ctx.req.headers['x-vercel-ip-country'] as string) || 'US';
    const currency = country === 'IN' ? 'inr' : 'usd';
    // Check for session to redirect if needed, but the page is public.
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { /* You might want to fetch the user's current plan and show it on the page */ }

    return { props: { currency } };
};

PricingPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};