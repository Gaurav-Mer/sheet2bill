/* eslint-disable react/no-unescaped-entities */
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        q: "Is Sheet2Bill really free to start?",
        a: "Yes, absolutely! Our Free plan is designed for freelancers and new businesses. It includes all the core features you need to manage clients, create professional briefs, and generate invoices, with generous limits."
    },
    {
        q: "Is my client and financial data secure?",
        a: "Security is our top priority. We use industry-standard security practices, powered by Supabase. Your data is encrypted, and we use strict Row Level Security, which means only you can ever access your own information."
    },
    {
        q: "What's the difference between a 'Brief' and an 'Invoice'?",
        a: "A 'Brief' is a pre-invoice summary of work that you send to your client for approval. This prevents disputes and errors. Once the client approves the Brief with a single click, you can convert it into a final, legal 'Invoice' for payment."
    },
    {
        q: "Can I import my existing data from a spreadsheet?",
        a: "Yes! Our CSV import feature allows you to easily migrate your existing client lists and project data, making the switch to Sheet2Bill seamless and fast."
    },
];

export function FaqSection() {
    return (
        <section className="py-24 sm:py-32 bg-secondary ">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Have questions? We've got answers.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                value={`item-${index}`}
                                key={index}
                                className="bg-card border border-border/50 rounded-xl px-6"
                            >
                                <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}