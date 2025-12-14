import { Clock, Shield, Zap, Award, TrendingUp, HeartHandshake } from 'lucide-react';

const benefits = [
    {
        icon: Clock,
        title: 'Save 5+ Hours Weekly',
        description: 'Stop juggling multiple tools and spreadsheets. Sheet2Bill automates your entire billing workflow, giving you back precious time to focus on actual client work.',
        stat: '90%',
        statLabel: 'Time saved',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Shield,
        title: 'Eliminate Billing Disputes',
        description: 'Pre-approval workflow means clients sign off before you bill. No more awkward conversations about scope creep or "I didn\'t agree to this" emails.',
        stat: 'Zero',
        statLabel: 'Invoice disputes',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: Zap,
        title: 'Get Paid Faster',
        description: 'Prevent disputes with our pre-invoice approval workflow, ensuring every invoice is correct and delivers professional results.',
        stat: '2x',
        statLabel: 'Faster payment',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Award,
        title: 'Look More Professional',
        description: 'Branded PDFs, consistent numbering, and polished approval workflows make you look like an established agency—even as a solo freelancer.',
        stat: '100%',
        statLabel: 'Client trust',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        icon: TrendingUp,
        title: 'Scale Without Chaos',
        description: 'Whether you have 5 clients or 50, Sheet2Bill keeps everything organized. No more digging through emails or losing track of what\'s been paid.',
        stat: '∞',
        statLabel: 'Client capacity',
        color: 'from-red-500 to-rose-500'
    },
    {
        icon: HeartHandshake,
        title: 'Built for Freelancers',
        description: 'We understand the freelance struggle. Every feature is designed to solve real problems you face daily—no bloat, no complexity, just what works.',
        stat: '★★★★★',
        statLabel: 'Easy to understand',
        color: 'from-indigo-500 to-purple-500'
    }
];

export function WhyChooseUs() {
    return (
        <section className="py-12 bg-[#f9efe4] relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)]" />

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full  mb-6 bg-white border-black border-2">
                        <span className="text-md font-bold text-black">Why Sheet2Bill</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                        Built for Freelancers Who Value Their Time
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Every feature is designed to solve real freelance billing headaches. No fluff, no complexity—just tools that actually make your life easier.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {benefits.map((item, index) => (
                        <div
                            key={index}
                            className="group relative bg-white border-l-2 border-b-2 border-black rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative p-8">
                                {/* Icon and stat */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`inline-flex p-4 bg-gradient-to-br ${item.color} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        <item.icon className="h-7 w-7 text-white" />
                                    </div>

                                    {/* Stat badge */}
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">{item.stat}</div>
                                        <div className="text-xs text-slate-500 font-medium">{item.statLabel}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {item.description}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Proof Section */}
                {/* <div className="mt-20 max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 border-2 border-primary/20 rounded-2xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Join Hundreds of Happy Freelancers
                            </h3>
                            <p className="text-slate-600">
                                Already saving time and getting paid faster
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    500+
                                </div>
                                <p className="text-sm text-slate-600">
                                    Active users
                                </p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    10k+
                                </div>
                                <p className="text-sm text-slate-600">
                                    Invoices generated
                                </p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    $2M+
                                </div>
                                <p className="text-sm text-slate-600">
                                    Total processed
                                </p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    4.9★
                                </div>
                                <p className="text-sm text-slate-600">
                                    Average rating
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </section>
    );
}