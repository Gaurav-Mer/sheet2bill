import Link from 'next/link'
import React from 'react'
import { Logo } from '../Logo'
import { Button } from '../ui/button'

const NonLoginNavbar = () => {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto h-16 flex items-center justify-between px-6">
                <Link href="/" className="flex items-center space-x-2 group">
                    <Logo className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-bold md:text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-xs">Sheet2Bill</span>
                </Link>
                <nav className="flex items-center md:space-x-2">
                    <Link href="/login" passHref>
                        <Button variant="ghost" className="hover:bg-primary/5">Login</Button>
                    </Link>
                    <Link href="/pricing" passHref>
                        <Button variant="ghost" className="hover:bg-primary/5">Pricing</Button>
                    </Link>
                    <Link href="/signup" passHref>
                        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
                            Start Free
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default NonLoginNavbar