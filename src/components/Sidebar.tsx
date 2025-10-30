import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, FileText, Settings, LogOut, BarChart3, Palette, CreditCard } from 'lucide-react';
import { Logo } from './Logo';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/briefs', label: 'Briefs', icon: FileText },
    { href: '/invoices', label: 'Invoices', icon: FileText },
    { href: '/reports', label: 'Reports', icon: BarChart3 }, // ADD THIS LINE
    // { href: '/settings/templates', label: 'Templates', icon: Palette }, // ADD THIS LINE
    { href: '/billing', label: 'Billing', icon: CreditCard }, // ADD THIS LINE
    { href: "/how-it-works", label: "How it Works", icon: Settings },

    // We can add a '/settings' link later
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
    const router = useRouter();
    const user = useUser();
    const supabaseClient = useSupabaseClient();

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/');
    };

    return (
        <aside className="flex flex-col w-64 bg-card border-r border-border h-full min-h-dvh">
            <div className="p-4 border-b border-border">
                <Link href="/dashboard" className="font-bold text-xl text-black flex items-center gap-1">
                    <Logo /> Sheet2Bill
                </Link>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = router.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            onClick={onClose}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            {/* User profile and logout section */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-semibold text-muted-foreground">
                            {user?.email?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground" title="Logout">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}