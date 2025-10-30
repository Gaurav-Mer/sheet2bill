/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, UserCircle, ChevronRight, Bell, Star } from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NotificationBell } from './NotificationBell';
import { useProfile } from '@/hooks/useProfile';

type NavbarProps = {
    onMenuClick: () => void;
};

// A helper function to generate breadcrumbs from the URL path
const generateBreadcrumbs = (pathname: string) => {
    const pathParts = pathname.split('/').filter((part) => part);
    const breadcrumbs = pathParts.map((part, index) => {
        const href = '/' + pathParts.slice(0, index + 1).join('/');
        // Capitalize the first letter and replace dashes with spaces
        const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        return { href, label };
    });
    // Always start with a link to the main dashboard
    return [{ href: '/dashboard', label: 'Home' }, ...breadcrumbs];
};

// Helper function to check if the user is on any paid or trial plan
const isPaidPlan = (status: string | null | undefined): boolean => {
    if (!status) return false;
    return ['trialing', 'starter', 'pro'].includes(status);
};

export const PlanStatus = () => {
    const { profile, isLoading } = useProfile();
    if (isLoading || !profile) {
        return <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />; // Loading skeleton
    }

    const getTrialDaysRemaining = () => {
        if (!profile?.subscription_ends_at) return 0;
        const endDate = new Date(profile.subscription_ends_at);
        const now = new Date();
        return Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    };

    return (
        <div className="hidden sm:flex items-center gap-4">
            {isPaidPlan(profile.subscription_status) ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Star className="h-4 w-4" />
                    {profile.subscription_status === 'trialing'
                        ? `Pro Trial (${getTrialDaysRemaining()}d left)`
                        : `${(profile?.subscription_status ?? "")?.charAt(0)?.toUpperCase() + profile?.subscription_status?.slice(1)} Plan`
                    }
                </div>
            ) : (
                <>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                    <Link href="/pricing" passHref>
                        <Button size="sm">Upgrade</Button>
                    </Link>
                </>
            )}
        </div>
    );
};




export function Navbar({ onMenuClick }: NavbarProps) {
    const user = useUser();
    const router = useRouter();
    const supabaseClient = useSupabaseClient();
    const [breadcrumbs, setBreadcrumbs] = useState<{ href: string, label: string }[]>([]);


    // Update breadcrumbs whenever the page changes
    useEffect(() => {
        setBreadcrumbs(generateBreadcrumbs(router.pathname));
    }, [router.pathname]);

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/'); // Redirect to homepage after logout
    };

    return (
        <header className="sticky top-0 z-30 flex h-[3.8rem] items-center gap-4 border-b bg-background px-4 sm:px-6">
            {/* --- Mobile Menu Button --- */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
            </Button>

            {/* --- PREMIUM: Dynamic Breadcrumbs for Desktop --- */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center gap-2">
                        <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                            {crumb.label}
                        </Link>
                        {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                ))}
            </nav>

            <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex items-center gap-4">
                    <PlanStatus />
                    <NotificationBell />
                </div>

                {/* --- PREMIUM: User Dropdown Menu with User Info --- */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                            <UserCircle className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">My Account</p>
                                <p className="text-xs leading-none text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleLogout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}