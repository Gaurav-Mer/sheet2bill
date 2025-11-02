/* eslint-disable react/no-unescaped-entities */
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        name: 'Alex Rivera',
        role: 'Freelance Web Developer',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        rating: 5,
        quote: "Sheet2Bill has been a game-changer for my freelance business. The pre-invoice approval flow saves me so much time and prevents any miscommunication with clients. It's a must-have tool!"
    },
    {
        name: 'Samantha Chen',
        role: 'Digital Marketing Consultant',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        rating: 5,
        quote: "I used to spend hours creating invoices manually. With Sheet2Bill, I can generate a professional, branded invoice from an approved brief in just one click. My clients are impressed, and I get paid faster."
    },
    {
        name: 'David Lee',
        role: 'UX/UI Designer',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        rating: 5,
        quote: "The ability to customize my invoices with my own branding is fantastic. Sheet2Bill is incredibly user-friendly and has all the features I need to manage my client billing efficiently."
    }
];

export function SocialProof() {
    return (
        <section className="py-24 sm:py-32 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Loved by Freelancers Worldwide
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Don't just take our word for it. Here's what our users are saying.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-card border border-border/50 rounded-xl p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <blockquote className="text-muted-foreground italic mb-6">
                                    "{testimonial.quote}"
                                </blockquote>
                            </div>
                            <div className="flex items-center">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={`${testimonial.name}, ${testimonial.role}`}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
