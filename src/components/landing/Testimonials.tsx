/* eslint-disable react/no-unescaped-entities */
import { Star } from "lucide-react"
import Image from "next/image"

const Testimonials = () => {
    return (
        <section className="bg-secondary py-20 px-4 md:px-0">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">What Our Users Say</h2>
                    <p className="text-lg text-gray-600 mt-2">We're trusted by thousands of freelancers and small businesses</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center mb-4">
                            <Image src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" alt="User 1" className="w-12 h-12 rounded-full mr-4" width={100} height={100} />
                            <div>
                                <h4 className="font-bold text-gray-900">Priya S.</h4>
                                <p className="text-gray-600">Digital Marketer</p>
                            </div>
                        </div>
                        <p className="text-gray-600">"The approval workflow is a game-changer. I've saved hours on back-and-forth emails and my clients love the professional briefs."</p>
                        <div className="flex mt-4">
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center mb-4">
                            <Image src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" alt="User 2" className="w-12 h-12 rounded-full mr-4" width={100} height={100} />
                            <div>
                                <h4 className="font-bold text-gray-900">John D.</h4>
                                <p className="text-gray-600">Freelance Writer</p>
                            </div>
                        </div>
                        <p className="text-gray-600">"Sheet2Bill has made my invoicing process so much easier. I can create and send professional invoices in minutes."</p>
                        <div className="flex mt-4">
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center mb-4">
                            <Image src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" alt="User 3" className="w-12 h-12 rounded-full mr-4" width={100} height={100} />
                            <div>
                                <h4 className="font-bold text-gray-900">Jane S.</h4>
                                <p className="text-gray-600">Graphic Designer</p>
                            </div>
                        </div>
                        <p className="text-gray-600">"I love how I can customize my invoices to match my brand. It's a small detail that makes a big difference."</p>
                        <div className="flex mt-4">
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { Testimonials }
