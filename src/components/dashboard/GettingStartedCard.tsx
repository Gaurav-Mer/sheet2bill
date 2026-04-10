// components/dashboard/GettingStartedCard.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, ArrowRight, X, UserCircle, Users, FileText, CreditCard } from 'lucide-react';

const DISMISS_KEY = 's2b_gs_dismissed';

type Step = {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
    done: boolean;
};

type GettingStartedCardProps = {
    clientCount: number;
    briefCount: number;
};

export default function GettingStartedCard({ clientCount, briefCount }: GettingStartedCardProps) {
    const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

    useEffect(() => {
        setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, 'true');
        setDismissed(true);
    };

    if (dismissed) return null;

    const steps: Step[] = [
        {
            id: 1,
            icon: <UserCircle className="h-5 w-5" />,
            title: 'Complete your profile',
            description: 'Add your name, company, address and logo — these appear on every invoice.',
            href: '/settings',
            linkLabel: 'Go to Settings',
            done: false,
        },
        {
            id: 2,
            icon: <Users className="h-5 w-5" />,
            title: 'Add your first client',
            description: 'Save a client\'s name and email so you can bill them quickly.',
            href: '/clients',
            linkLabel: 'Add Client',
            done: clientCount > 0,
        },
        {
            id: 3,
            icon: <FileText className="h-5 w-5" />,
            title: 'Create a brief & send an invoice',
            description: 'Draft a brief, get it approved, then convert it to an invoice in one click.',
            href: '/briefs/new',
            linkLabel: 'Create Brief',
            done: briefCount > 0,
        },
        {
            id: 4,
            icon: <CreditCard className="h-5 w-5" />,
            title: 'Set up how you get paid',
            description: 'Add your UPI ID, PayPal, or Stripe link — money goes directly to you.',
            href: '/settings#payment-methods',
            linkLabel: 'Set Up Payments',
            done: false,
        },
    ];

    const completedCount = steps.filter(s => s.done).length;
    const progressPct = Math.round((completedCount / steps.length) * 100);

    return (
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-5 pb-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-foreground">
                            Get started with Sheet2Bill
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {completedCount === steps.length
                                ? "You're all set! You can dismiss this."
                                : `Complete these steps to send your first invoice. (${completedCount}/${steps.length} done)`}
                        </p>
                        {/* Progress bar */}
                        <div className="mt-3 h-1.5 w-full max-w-xs rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex items-start gap-3 rounded-lg p-3 border transition-colors ${step.done
                                ? 'bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30'
                                : 'bg-background border-border hover:border-primary/30'
                                }`}
                        >
                            {/* Check / circle */}
                            <div className={`mt-0.5 flex-shrink-0 ${step.done ? 'text-green-600' : 'text-muted-foreground'}`}>
                                {step.done
                                    ? <CheckCircle2 className="h-5 w-5" />
                                    : <Circle className="h-5 w-5" />
                                }
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium leading-snug ${step.done ? 'text-green-700 dark:text-green-400 line-through' : 'text-foreground'}`}>
                                    {step.title}
                                </p>
                                {!step.done && (
                                    <>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                            {step.description}
                                        </p>
                                        <Link
                                            href={step.href}
                                            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline"
                                        >
                                            {step.linkLabel}
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </>
                                )}
                                {step.done && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Done!</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
