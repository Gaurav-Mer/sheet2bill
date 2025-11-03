import { Zap, CheckCircle, FileText } from 'lucide-react';

// The data structure is great as-is.
const steps = [
    {
        icon: Zap,
        title: 'Create Your Brief',
        description: 'Build a detailed brief with all your work items. Share it with your client using a secure link.',
    },
    {
        icon: CheckCircle,
        title: 'Get Client Approval',
        description: 'Your client reviews and approves with a single click. Handle revisions seamlessly in one place.',
    },
    {
        icon: FileText,
        title: 'Generate Invoice',
        description: 'Convert the approved brief into a professional PDF invoice. Send it and get paid faster.',
    },
];

export function HowItWorks() {
    return (
        // The background gradient is subtle and clean. We'll keep it.
        <section className="py-24 bg-primary/20">
            <div className="container mx-auto px-6">

                {/* 1. HEADER: Softer, "premium" text colors. */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-500">
                        Three simple steps to professional billing
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-16 md:gap-10 relative">

                        {/* 2. CONNECTOR LINE: Cleaner, simpler, and layered behind. */}
                        {/* A solid, light gray line is cleaner than a gradient. */}
                        <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-slate-200 z-0" />

                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                // We add z-10 and a background to place items "on top" of the line.
                                className="relative z-10 flex flex-col items-center text-center"
                            >
                                {/* 3. ICON & NUMBER: This is the biggest cleanup. */}
                                {/* We remove the blur, the thick border, and the hover:scale. */}
                                {/* The hover effect is now a subtle shadow 'glow' in the primary color. */}
                                <div className="group relative mb-8">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
                                        <step.icon className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* 4. TEXT: Softer colors and weights for a cleaner hierarchy. */}
                                {/* We remove the text color change on hover, as it's distracting. */}
                                <h3 className="text-xl font-semibold text-slate-700 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed max-w-xs">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. CTA: A "pill" shape and more subtle hover feels more modern. */}
                {/* We remove the 'scale' and use a shadow glow instead. */}
                <div className="text-center mt-24">
                    <button className="px-10 py-4 bg-primary text-white rounded-full font-bold text-base shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out">
                        Get Started Free
                    </button>
                </div>
            </div>
        </section>
    );
}