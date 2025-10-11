import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Twitter, Linkedin, Github } from 'lucide-react';

const productLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/login", label: "Login" },
];

const legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
];

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-slate-100">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand Info */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <Logo className="h-6 w-6" />
                            <span className="font-bold text-xl">Sheet2Bill</span>
                        </Link>
                        <p className="mt-4 text-muted-foreground max-w-xs">
                            The smart, professional workflow for freelancers and small agencies.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            {productLinks.map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Sheet2Bill. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}