/* eslint-disable react/no-unescaped-entities */
// components/TrialExpiredBanner.tsx
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type TrialExpiredBannerProps = {
    onDismiss: () => void;
};

export function TrialExpiredBanner({ onDismiss }: TrialExpiredBannerProps) {
    return (
        <div className="relative bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                        Your Pro Trial Has Ended
                    </p>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        You've been moved to the Free plan. To keep your Pro features, please upgrade your account.
                    </p>
                    <div className="mt-3">
                        <Link href="/pricing" passHref>
                            <Button size="sm">Upgrade to Pro</Button>
                        </Link>
                    </div>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-800/50"
                            title="Dismiss"
                        >
                            <span className="sr-only">Dismiss</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}