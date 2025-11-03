
import { ArrowDown } from "lucide-react"
import Image from "next/image"

/* eslint-disable react/no-unescaped-entities */
const HowItWorks = () => {
    return (
        <section className="bg-background py-20 px-4 md:px-0">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">How It Works</h2>
                    <p className="text-lg text-gray-600 mt-2">Our simple 3-step process to get you started</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Step 1 */}
                    <div className="w-full md:w-1/3 text-center">
                        <Image src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="Step 1" className="rounded-lg shadow-lg mb-4" width={800} height={600} />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Brief</h3>
                        <p className="text-gray-600">
                            Quickly build a detailed brief with all your work items and notes. Share it with your client using a secure public or password-protected link.
                        </p>
                    </div>

                    <ArrowDown className="hidden md:block text-primary" size={48} />

                    {/* Step 2 */}
                    <div className="w-full md:w-1/3 text-center">
                        <Image src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="Step 2" className="rounded-lg shadow-lg mb-4" width={800} height={600} />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Client Approval</h3>
                        <p className="text-gray-600">
                            Your client reviews the brief via the link and approves the work with a single click. Revisions are handled seamlessly, all in one place.
                        </p>
                    </div>

                    <ArrowDown className="hidden md:block text-primary" size={48} />

                    {/* Step 3 */}
                    <div className="w-full md:w-1/3 text-center">
                        <Image src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="Step 3" className="rounded-lg shadow-lg mb-4" width={800} height={600} />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Generate Your Invoice</h3>
                        <p className="text-gray-600">
                            Instantly convert the approved brief into a professional PDF invoice. Download it or send it to your client to get paid faster.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <a href="/register" className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary-dark transition-colors">
                        Get Started
                    </a>
                </div>
            </div>
        </section>
    )
}

export { HowItWorks }
