import { Zap, CheckCircle, FileText } from 'lucide-react';

const steps = [
    {
        icon: Zap,
        title: '1. Create Your Brief',
        description: 'Build a detailed brief from scratch or a CSV. Add line items, notes, choose a premium template, and generate a secure link.',
    },
    {
        icon: CheckCircle,
        title: '2. Get Client Approval',
        description: 'Your client reviews the work and approves it with a single click. Revisions are handled seamlessly, all in one place.',
    },
    {
        icon: FileText,
        title: '3. Generate Your Invoice',
        description: 'Convert the approved brief into a stunning PDF invoice. Download it or send it to your client to get paid faster.',
    },
];

export function HowItWorks() {
    return (
        <section className="bg-gradient-to-b from-secondary/20 to-primary/10 py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        A Workflow That Just Works
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Three simple steps to professional billing and faster payments.
                    </p>
                </div>

                <div className="relative">
                    {/* This is the dashed line connecting the steps on larger screens */}
                    <div
                        aria-hidden="true"
                        className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-border -translate-y-1/2 hidden md:block"
                    />

                    <div className="relative grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className="relative p-8 bg-card border border-border rounded-xl shadow-sm animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="inline-block p-4 bg-primary/10 rounded-lg mb-4">
                                        <step.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
