// components/landing/TemplateShowcase.tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { AVAILABLE_TEMPLATES } from '@/lib/templates';
import { sampleInvoiceData } from '@/lib/sample-data';
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { CurrentTemplate } from './templates/CurrentTemplate';

export const TemplateShowcase = () => {
    return (
        <Carousel
            opts={{
                loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
        >
            <CarouselContent>
                {AVAILABLE_TEMPLATES.map((template) => {
                    // Generate the full HTML for each template
                    const templateHtml = renderToStaticMarkup(
                        <CurrentTemplate
                            templateId={template.id as string}
                            data={{ ...sampleInvoiceData, settings: template.settings }}
                        />
                    );
                    return (
                        <CarouselItem key={template.id}>
                            <div className="p-1">
                                <Card className="overflow-hidden shadow-2xl border">
                                    <CardContent className="flex aspect-[1/1.414] items-center justify-center p-0">
                                        {/* Each template is rendered in an iframe for perfect style isolation */}
                                        <iframe
                                            srcDoc={templateHtml}
                                            className="w-full h-full border-0"
                                            title={`${template.name} Preview`}
                                            scrolling="no"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
    );
};