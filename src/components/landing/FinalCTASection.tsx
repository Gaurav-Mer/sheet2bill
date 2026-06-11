'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FinalCTASection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            aria-labelledby="cta-heading"
            className="relative py-12 overflow-hidden bg-white border-t border-zinc-200/60"
        >
            {/* Minimal High-End Geometric Line Layout Grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] opacity-[0.3]"
            />

            {/* Subtle Glow mapped directly to your primary color token */}
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 text-center relative z-10">
                <div className={`max-w-3xl mx-auto space-y-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    {/* Universal Minimal Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 shadow-none">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-zinc-600 text-xs  tracking-wider uppercase">Predictable Infrastructure</span>
                    </div>

                    {/* Clean High-Impact Typography Header */}
                    <div id="cta-heading" className="text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-900 leading-[1.12] tracking-tight">
                        Stop losing billing velocity <br className="hidden sm:inline" />
                        <span className="font-serif italic text-primary">to fragmented workflows.</span>
                    </div>

                    {/* Subheading Body Description */}
                    <p className="text-base md:text-lg lg:text-xl text-zinc-500 font-normal leading-relaxed max-w-2xl mx-auto">
                        Minimize administrative overhead. Accelerate client transaction pipelines and secure revenue cycles inside a single unified engine.
                    </p>

                    {/* Premium Call to Actions Row using Primary brand hooks */}
                    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <Link href="/try" passHref legacyBehavior>
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-11 bg-primary hover:bg-primary/95 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-300 group hover:-translate-y-0.5 tracking-normal px-6"
                                aria-label="Create your first free invoice"
                            >
                                Create Free Invoice
                                <ArrowRight
                                    className="ml-2 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </Button>
                        </Link>

                        <Link href="#pricing" passHref legacyBehavior>
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-11 px-6 text-sm font-medium bg-zinc-50 text-zinc-800 hover:bg-zinc-100 border border-zinc-200/80 rounded-lg shadow-none transition-all duration-300 hover:-translate-y-0.5 tracking-normal"
                            >
                                View Pricing
                            </Button>
                        </Link>
                    </div>

                    {/* Micro Footer Notice */}
                    <p className=" text-xs md:text-sm  tracking-normal pt-2">
                        Onboarding takes 2 minutes • No automatic trial loops • Starter layer inclusive
                    </p>
                </div>
            </div>
        </section>
    );
}