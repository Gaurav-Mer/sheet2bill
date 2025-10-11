import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch'; // Assuming you have a Switch component
import { Label } from '@/components/ui/label';

// --- THE DATA STRUCTURE ---
// This is the "single source of truth". To add a new feature, just add it to the list.
const ALL_FEATURES = {
    clients: "Manage Clients",
    briefs: "Briefs & Approval Workflow",
    invoices: "Invoice Generation",
    pdf_downloads: "Premium PDF Downloads",
    email_sending: "Send Invoices via Email",
    custom_branding: "Custom Branding (Logo & Color)",
    premium_templates: "Premium Template Gallery",
    csv_import: "CSV Data Import",
    reports: "Analytics & Reports",
};

// Define what each plan gets. This makes it incredibly easy to change limits.
const PLANS = [
    {
        name: 'Free',
        price: { monthly: '₹0', annually: '₹0' },
        description: 'For individuals and hobby projects just getting started.',
        cta: 'Get Started',
        features: [
            { text: '5 Clients', included: true },
            { text: '10 Briefs & Invoices / month', included: true },
            { text: ALL_FEATURES.pdf_downloads, included: true },
            { text: ALL_FEATURES.custom_branding, included: false },
            { text: ALL_FEATURES.premium_templates, included: false },
            { text: ALL_FEATURES.csv_import, included: false },
        ],
        isPopular: false,
    },
    {
        name: 'Pro',
        price: { monthly: '₹799', annually: '₹7,990' },
        description: 'For growing freelancers and businesses who need more power.',
        cta: 'Upgrade to Pro',
        features: [
            { text: 'Unlimited Clients', included: true },
            { text: 'Unlimited Briefs & Invoices', included: true },
            { text: ALL_FEATURES.pdf_downloads, included: true },
            { text: ALL_FEATURES.custom_branding, included: true },
            { text: ALL_FEATURES.premium_templates, included: true },
            { text: ALL_FEATURES.csv_import, included: true },
        ],
        isPopular: true,
    },
    {
        name: 'Agency',
        price: { monthly: 'Contact Us', annually: 'Contact Us' },
        description: 'For teams and agencies managing multiple clients.',
        cta: 'Contact Sales',
        features: [
            { text: 'Everything in Pro', included: true },
            { text: 'Team Members (Coming Soon)', included: true },
            { text: 'Priority Support', included: true },
            { text: ALL_FEATURES.reports, included: true },
        ],
        isPopular: false,
    },
];

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <div className="container mx-auto mt-10 max-w-6xl">
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find the Plan That&apos;s Right for You</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Start for free and scale as you grow. No hidden fees.
                </p>
                <div className="flex items-center justify-center space-x-2 mt-8">
                    <Label htmlFor="billing-cycle">Monthly</Label>
                    <Switch id="billing-cycle" checked={isAnnual} onCheckedChange={setIsAnnual} />
                    <Label htmlFor="billing-cycle">Annually (Save 15%)</Label>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {PLANS.map((plan, index) => (
                    <Card
                        key={plan.name}
                        className={`animate-fade-in-up ${plan.isPopular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">{isAnnual ? plan.price.annually : plan.price.monthly}</span>
                                {plan.price.monthly !== 'Contact Us' && plan.price.monthly !== '₹0' && <span className="text-muted-foreground ml-2">/ {isAnnual ? 'year' : 'month'}</span>}
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map(feature => (
                                    <li key={feature.text} className={`flex items-center gap-3 ${!feature.included ? 'text-muted-foreground line-through' : ''}`}>
                                        {feature.included
                                            ? <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            : <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                                        }
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href="/signup" passHref className="w-full">
                                <Button
                                    className="w-full h-11"
                                    variant={plan.isPopular ? 'default' : 'outline'}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

PricingPage.getLayout = function getLayout(page: ReactElement) {
    return page; // This page will not have the main app sidebar
};