import { useProfile } from '@/hooks/useProfile';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { UpgradeModal } from './UpgradeModal';

// A helper to determine if the user has a paid plan
const isPaidUser = (status: string | null | undefined): boolean => {
    if (!status) return false;
    return ['trialing', 'starter', 'pro'].includes(status);
};

type FeatureGateProps = {
    children: React.ReactNode;
};

export function FeatureGate({ children }: FeatureGateProps) {
    const { profile, isLoading } = useProfile();
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);

    // While loading, show a skeleton or nothing
    if (isLoading) {
        return <div className="h-24 w-full rounded-md bg-muted animate-pulse" />;
    }

    // If the user has a paid plan, show the feature
    if (isPaidUser(profile?.subscription_status)) {
        return <>{children}</>;
    }

    // If the user is on the free plan, show the gated version
    return (
        <div className="relative">
            {/* The disabled content underneath */}
            <div className="opacity-100 shadow-2xl">{children}</div>

            {/* The overlay with the upgrade message */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 rounded-2xl cursor-pointer"
                onClick={() => setUpgradeModalOpen(true)}
            >
                <div className="flex items-center gap-2 text-sm font-semibold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4" /> Pro Feature
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">Click to Upgrade</p>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                message="Upgrade to a Pro plan to unlock this feature and more."
            />
        </div>
    );
}
