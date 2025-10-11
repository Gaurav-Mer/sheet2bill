import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types';
import { Star, PartyPopper } from 'lucide-react';
import Link from 'next/link';

type BillingPageProps = {
    profile: Profile | null;
};

export default function BillingPage({ profile }: BillingPageProps) {
    // Helper to format the date nicely
    const getFormattedEndDate = () => {
        if (!profile?.subscription_ends_at) return 'January 31, 2026';
        return new Date(profile.subscription_ends_at).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const endDate = getFormattedEndDate();

    return (
        <div className="container mx-auto  max-w-4xl">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Billing & Plan</h1>
                    <p className="text-muted-foreground mt-2">Manage your subscription and view billing history.</p>
                </div>

                {/* --- Current Plan Card --- */}
                <Card className="border-primary/50 shadow-lg">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <PartyPopper className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <div>
                            <CardTitle>You&rsquo;re on the Free Beta Plan!</CardTitle>
                            <CardDescription>
                                As an early user, you have full access to all Pro features, completely free.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline text-3xl font-bold">
                            ₹0<span className="ml-2 text-xl font-medium text-muted-foreground">/ month</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Your free beta access is valid until **{endDate}**.
                        </p>
                    </CardContent>
                </Card>

                {/* --- What's Next Card --- */}
                <Card>
                    <CardHeader>
                        <CardTitle>What Happens After the Beta?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            On {endDate}, your account will automatically transition to our standard Free plan.
                            **You will not be charged automatically.** Your data will remain safe, but your account will be subject to the Free plan&apos;s limits (e.g., 5 clients).
                        </p>
                        <p className="mt-4 text-muted-foreground">
                            You will have the option to upgrade to a paid plan at any time to continue using the premium features.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/pricing" passHref>
                            <Button variant="outline">View Future Plans</Button>
                        </Link>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}

// in pages/billing.tsx

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { redirect: { destination: '/login', permanent: false } };
    }

    // Fetch the user's profile to get their subscription end date
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_ends_at')
        // --- THIS IS THE CRITICAL FIX ---
        // We must specify WHICH profile to get.
        .eq('id', session.user.id)
        // --- END OF FIX ---
        .single();

    return {
        props: {
            profile: profile || null,
        },
    };
};