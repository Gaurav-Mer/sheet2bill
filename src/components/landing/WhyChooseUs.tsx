import { Clock, Shield, Zap, Award, TrendingUp, HeartHandshake } from 'lucide-react';

const benefits = [
    {
        icon: Clock,
        title: 'Save Hours Every Week',
        description: 'Stop juggling multiple tools and spreadsheets. Sheet2Bill unifies your entire workflow, giving you back valuable time to focus on your billable work.',
        stat: 'Faster',
        statLabel: 'Invoice cycles',
    },
    {
        icon: Shield,
        title: 'Eliminate Billing Disputes',
        description: 'Our integrated approval step means clients sign off on scope and pricing before you bill. Permanent protection against scope creep and awkward emails.',
        stat: 'Zero',
        statLabel: 'Client disputes',
    },
    {
        icon: Zap,
        title: 'Get Paid Faster',
        description: 'Embed clean, instant payment routing options directly inside your invoices. Clients pay effortlessly with a single click without payment barriers.',
        stat: 'Instant',
        statLabel: 'Clearing tracks',
    },
    {
        icon: Award,
        title: 'Look More Professional',
        description: 'Branded documents, sequential bookkeeping number outputs, and beautiful approval portals make you look like an established agency from day one.',
        stat: 'Branded',
        statLabel: 'PDF exports',
    },
    {
        icon: TrendingUp,
        title: 'Scale Without Chaos',
        description: 'Whether managing 5 active projects or 50, everything stays perfectly sorted. Stop digging through messy email logs or tracking tables to find records.',
        stat: 'Uncapped',
        statLabel: 'Client pipelines',
    },
    {
        icon: HeartHandshake,
        title: 'Built for Freelancers',
        description: 'We understand the independent business grind. Every aspect of our platform is refined to solve real, daily administrative headaches. No fluff, just utility.',
        stat: '100%',
        statLabel: 'Tailored for you',
    },
];

export function WhyChooseUs() {
    return (
        <section className="relative py-12 overflow-hidden bg-white border-t border-zinc-200/60">

            {/* Minimal High-End Geometric Line Layout Grid */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.3]" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header Copy Stack */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50">
                        <span className="text-sm  tracking-wider text-zinc-500 uppercase">Why Sheet2Bill</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-zinc-900 leading-[1.15]">
                        Built for freelancers who <br className="hidden sm:inline" />
                        value their <span className="font-serif italic text-primary">productive time</span>.
                    </h2>

                    <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-zinc-500 font-normal">
                        Every feature solves a real operational headache. No unnecessary clutter—just straightforward tools that make your invoice management faster.
                    </p>
                </div>

                {/* Clean, Premium Grid Layout Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefits.map((item, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-zinc-200/80 bg-zinc-50/40 transition-all duration-300 hover:bg-white hover:border-primary/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.03)]"
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between space-y-8">

                                {/* Icon + Quick Stat Data Row Header */}
                                <div className="flex items-start justify-between">
                                    <div className="inline-flex p-3 bg-white border border-zinc-200 rounded-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:border-primary">
                                        <item.icon className="h-5 w-5 text-zinc-700 transition-colors duration-300 group-hover:text-white" aria-hidden="true" />
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <div className="text-lg md:text-xl mt-1 font-semibold  text-primary leading-none tracking-tight">
                                            {item.stat}
                                        </div>
                                        <div className="text-xs  font-medium text-zinc-400 uppercase tracking-tight">
                                            {item.statLabel}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Descriptive Information Content Block */}
                                <div className="space-y-2">
                                    <h3 className="text-lg md:text-xl font-semibold tracking-tight text-zinc-900 group-hover:text-primary transition-colors duration-200">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-normal">
                                        {item.description}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}