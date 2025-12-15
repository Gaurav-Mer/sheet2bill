import { Menu, UserCircle, ChevronRight, Star } from 'lucide-react';
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
import { Logo } from './Logo';
import { MaleProfileSvg, StartSvg } from './SVG/Laptop';
import { differenceInDays } from 'date-fns';
import { twMerge } from 'tailwind-merge';

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

export const PlanStatus = () => {
    const { profile, isLoading } = useProfile();

    if (isLoading) {
        return <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />; // Loading skeleton
    }

    // OPTIMIZATION: Calculate Status Locally to avoid API calls in Navbar
    const isPro = profile?.subscription_ends_at
        ? new Date(profile.subscription_ends_at) > new Date()
        : false;

    const getDaysLeft = () => {
        if (!profile?.subscription_ends_at) return 0;
        const endDate = new Date(profile.subscription_ends_at);
        return endDate ? Math.max(0, differenceInDays(endDate, new Date())) : 0;
    };

    const daysLeft = isPro ? getDaysLeft() : 0;

    return (
        <div className="hidden sm:flex items-center gap-4">
            {isPro ? (
                // --- PRO VIEW: Show Days Left ---
                <div className={twMerge("flex items-center gap-2 text-sm font-semibold text-primary px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5", daysLeft === 0 && "text-destructive bg-destructive/5")}>
                    {daysLeft === 0 ? null : <StartSvg />}
                    <span>
                        {daysLeft === 0 ? "Plan expiring today" : `Pro Pass (${daysLeft}d left)`}
                    </span>
                </div>
            ) : (
                // --- FREE VIEW: Show Upgrade Button ---
                <>
                    <p className="text-sm text-muted-foreground hidden lg:block">Free Plan</p>
                    <Link href="/pricing" passHref>
                        <Button size="sm" className="bg-gradient-to-r from-primary/90 to-primary text-white shadow-sm hover:shadow-md transition-all">
                            Upgrade
                        </Button>
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
        <header className="sticky top-0 z-30 flex h-[3.8rem] items-center  gap-2 md:gap-4 border-b bg-background px-4 sm:px-6">
            {/* --- Mobile Menu Button --- */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <Logo className='md:hidden' />
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

                {/* --- User Dropdown Menu with User Info --- */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/* Replaced standard button with your SVG container */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full cursor-pointer uppercase border border-black  text-white bg-primary transition-colors">
                            {user?.email?.[0]}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
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
                            <Link href="/settings" className="cursor-pointer">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings/public-view" className="cursor-pointer">Public Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/pricing" className="cursor-pointer font-medium text-primary">Upgrade Plan</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}