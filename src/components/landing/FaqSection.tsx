import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, Sparkles } from "lucide-react";
import Head from "next/head";

const faqs = [
    {
        q: "Is Sheet2Bill really free to start?",
        a: "Yes, absolutely. Our Free plan is engineered for independent professionals and growing businesses. It includes all essential modules to manage client structures, customize project briefs, and output compliant invoices with generous allocation limits."
    },
    {
        q: "Is my client and financial data secure?",
        a: "Data protection is our highest priority. We implement enterprise-grade security structures powered by automated data layers. Your transaction data is fully encrypted at rest and in transit, governed by strict row-level execution policies."
    },
    {
        q: "What is the difference between a 'Brief' and an 'Invoice'?",
        a: "A 'Brief' acts as an immutable, pre-billing summary distributed to client stakeholders to collect formal, digital sign-offs on scopes and terms. Once authorized with a single click, the platform instantly populates those parameters into a clean tax 'Invoice' ready for clearing."
    },
    {
        q: "How can I share a brief with my client or team?",
        a: "Every transaction item generates an encrypted, unique URL. You can share access publicly for rapid verification pathways or enforce strict access control layers by appending a unique passkey layer before client delivery."
    },
    {
        q: "Can I customize my invoices?",
        a: "Yes. You can seamlessly map your corporate assets, balance brand color configurations, and append unique localized notes across your briefs and invoice layers to maintain a refined, cohesive commercial identity."
    },
    {
        q: "Who is this platform designed for?",
        a: "Sheet2Bill is engineered for freelancers, consultants, and independent agencies looking to optimize their contract-to-payment timelines. If you want to eliminate fragmented spreadsheets and chasing client approvals through manual threads, this architecture is built for you."
    }
];

export function FaqSection() {
    const ldJson = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-white border-t border-zinc-200/60">
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
                />
            </Head>

            {/* Minimal High-End Geometric Line Layout Grid */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-[0.3]" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header Copy Stack */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs  tracking-wider text-zinc-500 uppercase">Information Hub</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 leading-[1.15]">
                        Frequently Asked <span className="font-serif italic text-primary">Questions</span>
                    </h2>

                    <p className="max-w-xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-zinc-500 font-normal">
                        Everything required to understand our workspace pipelines and transaction architecture.
                    </p>
                </div>

                {/* Premium Accordion Panel Matrix wrapper */}
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                value={`item-${index}`}
                                key={index}
                                className="bg-zinc-50/40 border border-zinc-200/80 rounded-2xl px-6 md:px-8 transition-all duration-300 hover:bg-white hover:border-primary/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.03)] group"
                            >
                                <AccordionTrigger className="text-base md:text-lg lg:text-xl text-left font-medium tracking-tight text-zinc-900 py-6 hover:no-underline group-hover:text-primary transition-colors duration-200 gap-4 [&[data-state=open]>svg]:text-primary">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm md:text-base text-zinc-500 leading-relaxed pb-6 pt-2 border-t border-zinc-200/60 mt-1 transition-colors group-hover:text-zinc-600">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Minimalist Auxiliary Support Callout Footprint */}
                <div className="mt-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-zinc-50 border border-zinc-200/80 rounded-full shadow-sm">
                        <HelpCircle className="h-4 w-4 text-zinc-400" />
                        <p className="text-sm md:text-base font-normal text-zinc-600 tracking-normal">
                            Still exploring operational specs?{" "}
                            <a href="#support" className="text-primary hover:underline underline-offset-4 font-semibold transition-colors">
                                Contact core engineering →
                            </a>
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}