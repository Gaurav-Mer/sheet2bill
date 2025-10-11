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
        <footer className="border-t border-border bg-slate-800  text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">

                    {/* Column 1: Brand & Socials */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <Logo className="h-8 w-8" />
                            <span className="font-bold text-xl">Sheet2Bill</span>
                        </Link>
                        <p className="mt-4  max-w-xs">
                            The smart, professional workflow for freelancers and small agencies.
                        </p>
                        {/* <div className="mt-6 flex space-x-4">
                            <Link href="#" className=""><Twitter /></Link>
                            <Link href="#" className=""><Linkedin /></Link>
                            <Link href="#" className=""><Github /></Link>
                        </div> */}
                    </div>

                    {/* Column 2: Product Links */}
                    <div className="col-span-1">
                        <h3 className="font-semibold  mb-4">Product</h3>
                        <ul className="space-y-2">
                            {productLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="  transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Legal Links */}
                    <div className="col-span-1">
                        <h3 className="font-semibold  mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white  transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* --- Bottom Bar --- */}
                <div className="mt-12 border-t border-border pt-6 text-center text-sm text-white">
                    <p>© {new Date().getFullYear()} Sheet2Bill. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}