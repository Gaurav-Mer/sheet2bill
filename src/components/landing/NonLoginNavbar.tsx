import Link from 'next/link'
import React, { FC } from 'react'
import { Logo } from '../Logo'
import { Button } from '../ui/button'
import { useProfile } from '@/hooks/useProfile'

interface IProps {
    pageType?: string
}

const NonLoginNavbar: FC<IProps> = ({ pageType: _pageType }) => {
    const { profile } = useProfile();

    return (
        <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <Logo className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-bold text-base bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Sheet2Bill
                    </span>
                </Link>

                {/* Nav + CTA */}
                <nav className="flex items-center gap-0.5 sm:gap-1">
                    <Link href="/blog" passHref>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/5 text-sm font-medium px-3">
                            Blog
                        </Button>
                    </Link>
                    <Link href="/tools/rate-calculator" passHref>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/5 text-sm font-medium px-3">
                            Tools
                        </Button>
                    </Link>

                    {!profile?.username && (
                        <>
                            <Link href="#pricing" passHref>
                                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-primary/5 text-sm font-medium px-3">
                                    Pricing
                                </Button>
                            </Link>
                            <Link href="/login" passHref>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/5 text-sm font-medium px-3">
                                    Login
                                </Button>
                            </Link>
                            <div className="w-px h-4 bg-border/60 mx-1 hidden sm:block" aria-hidden="true" />
                            <Link href="/signup" passHref>
                                <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 h-9 rounded-lg shadow-sm shadow-primary/20 transition-all duration-200 hover:shadow-md hover:shadow-primary/25"
                                >
                                    <span className="sm:hidden">Start</span>
                                    <span className="hidden sm:inline">Start Free</span>
                                </Button>
                            </Link>
                        </>
                    )}

                    {profile?.username && (
                        <Link href="/dashboard" passHref>
                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 h-9 rounded-lg shadow-sm shadow-primary/20 transition-all duration-200"
                            >
                                Dashboard
                            </Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default NonLoginNavbar
