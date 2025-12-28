import { AVAILABLE_TEMPLATES } from "@/lib/templates";
import Image from "next/image";

export default function InvoiceTemplatesShowCase() {
    return (
        <div className="bg-[#f9efe4] backdrop-blur-3xl  py-12 px-6 ">
            <div className="max-w-6xl mx-auto text-center">
                <div className="inline-flex items-center   space-x-2 px-4 py-2 bg-white border-black border-2 rounded-full mb-6">
                    <span className="text-md font-bold text-black ">Powerful Features</span>
                </div>
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-4">
                        Invoice Templates
                    </h2>
                    <p className="text-lg text-black">
                        Professionally designed for modern businesses
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {AVAILABLE_TEMPLATES.map((template) => (
                        <div
                            key={template.id}
                            className="group cursor-pointer"
                        >
                            {/* Template Preview */}
                            <div className="relative aspect-[3/4] bg-white border-black rounded-lg overflow-hidden mb-4 border  transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-300">
                                <Image
                                    src={template.img}
                                    alt={`${template.name} invoice template`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                    quality={95}
                                    loading="lazy"
                                />
                            </div>

                            {/* Template Info */}
                            <div >
                                <h3 className="text-lg text-center font-semibold text-black mb-1">
                                    {template.name}
                                </h3>
                                {/* <p className="text-sm text-gray-500">
                                    {template.description}
                                </p> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}