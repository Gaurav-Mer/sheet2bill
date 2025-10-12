/* eslint-disable react/no-unescaped-entities */
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactElement } from 'react';
import Link from 'next/link';

export default function Custom404() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <div className="text-center">
                <div className="inline-block rounded-full bg-primary/10 p-4">
                    <SearchX className="h-12 w-12 text-primary" />
                </div>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    404 - Page Not Found
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="mt-10">
                    <Link href="/">
                        <Button size="lg">Go Back Home</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

// This page typically does not use the main app layout
Custom404.getLayout = function getLayout(page: ReactElement) {
    return page;
};
