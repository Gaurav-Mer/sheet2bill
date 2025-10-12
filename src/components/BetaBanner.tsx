import { Megaphone } from 'lucide-react';

export function BetaBanner() {
    return (
        <div className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-6 py-2.5 text-center">
                <div className="flex items-center justify-center gap-x-3">
                    <Megaphone className="h-5 w-5" aria-hidden="true" />
                    <p className="text-sm font-semibold leading-6">
                        <span className="font-bold">Public Beta Offer:</span>
                        &nbsp;Get full access for free until January 31st, 2026!
                    </p>
                </div>
            </div>
        </div>
    );
}