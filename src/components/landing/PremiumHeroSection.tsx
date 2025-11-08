import { Sparkles, ArrowRight, Check, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function PremiumHeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <div className="text-center md:text-left space-y-8 mt-4">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">The Future of Freelance Invoicing</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                            Effortless Billing,
                            <br />
                            <span className="relative inline-block mt-2">
                                <span className="relative z-10 text-white px-4 py-1">Professional</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transform -rotate-1 rounded-lg" />
                            </span>
                            {' '}Results.
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed">
                            Manage clients, create professional briefs, get approvals, and track invoices—all in one place. Experience effortless billing with professional results that impress your clients.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                            <Link href="/signup" passHref>
                                <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 group">
                                    Get Started - It&lsquo;s Free
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#features" passHref>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-primary/5 hover:border-primary/50">
                                    Discover Features
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-center md:justify-start space-x-8 pt-8 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>Free forever plan</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="hidden md:block">
                        <div className="relative">
                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-2xl transform rotate-12 animate-pulse" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-2xl transform -rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />

                            {/* Main Card */}
                            <div className="relative p-6 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-primary/10 transform hover:scale-105 transition-transform duration-500">
                                {/* Browser Chrome */}
                                <div className="bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/30">
                                    <div className="flex justify-between items-center px-4 py-3 bg-secondary/30 border-b border-border/30">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
                                            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
                                            sheet2bill.com
                                        </div>
                                        <div className="w-16" />
                                    </div>

                                    {/* App Preview */}
                                    <div className="p-6 bg-gradient-to-br from-secondary/10 to-background">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="font-bold text-xl">Project Alpha</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Client Dashboard</p>
                                            </div>
                                            <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-600 text-sm font-semibold rounded-full">
                                                ✓ Paid
                                            </div>
                                        </div>

                                        <div className="relative aspect-video bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 overflow-hidden">
                                            <Image
                                                src="/landing.png"
                                                alt="Sheet2Bill Dashboard Preview - Client Project Alpha Invoice Paid"
                                                fetchPriority='high'
                                                width={400}
                                                height={250}
                                                className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-center mt-6 text-sm font-medium text-muted-foreground">
                                    Your new command center awaits
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}