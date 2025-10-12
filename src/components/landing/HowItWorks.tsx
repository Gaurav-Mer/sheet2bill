import { Zap, CheckCircle, FileText } from 'lucide-react';

const steps = [
    {
        icon: Zap,
        title: '1. Create Your Brief',
        description: 'Quickly build a detailed brief with all your work items and notes. Share it with your client using a secure public or password-protected link.',
    },
    {
        icon: CheckCircle,
        title: '2. Get Client Approval',
        description: 'Your client reviews the brief via the link and approves the work with a single click. Revisions are handled seamlessly, all in one place.',
    },
    {
        icon: FileText,
        title: '3. Generate Your Invoice',
        description: 'Instantly convert the approved brief into a professional PDF invoice. Download it or send it to your client to get paid faster.',
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 sm:py-32 bg-slate-100">
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
                    {/* Dashed line for larger screens */}
                    <div
                        aria-hidden="true"
                        className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-border -translate-y-1/2 hidden md:block"
                    />

                    <div className="relative grid md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div
                                key={step.title}
                                className="relative p-8 bg-card border border-border/50 rounded-xl shadow-sm"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                                        <step.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{step.title}</h3>
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