// pages/settings/templates/[id].tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { InvoiceTemplateDefinition, TemplateSettings } from '@/types';
// import { PREDEFINED_TEMPLATES } from '@/lib/templates';
import InvoiceTemplate from '@/components/invoices/InvoiceTemplate'; // Our premium template
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleInvoiceData } from '@/lib/sample-data'; // We'll create this file next
import { renderToStaticMarkup } from 'react-dom/server';

type PageProps = {
    template: InvoiceTemplateDefinition;
    isCustomTemplate: boolean;
};

export default function TemplateEditorPage({ template, isCustomTemplate }: PageProps) {
    const router = useRouter();
    const [name, setName] = useState(template.name);
    const [settings, setSettings] = useState<TemplateSettings>(template.settings);

    const handleSettingChange = (section: keyof TemplateSettings, key: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const saveMutation = useMutation({
        mutationFn: async (payload: { name: string; settings: TemplateSettings }) => {
            const isUpdating = isCustomTemplate;
            const url = isUpdating ? `/api/templates/${template.id}` : '/api/templates';
            const method = isUpdating ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save template');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Template saved successfully!');
            router.push('/settings/templates');
        },
        onError: () => toast.error('Error saving template.'),
    });

    const handleSave = () => {
        saveMutation.mutate({ name, settings });
    };

    const invoiceHtml = renderToStaticMarkup(
        <InvoiceTemplate data={{ ...sampleInvoiceData, settings }} />
    );

    return (
        <div className="container mx-auto mt-10 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-8">
                {/* --- Left Sidebar: The Editor Controls --- */}
                <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customize Template</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="templateName">Template Name</Label>
                                <Input id="templateName" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="primaryColor">Primary Color</Label>
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    value={settings?.theme?.primaryColor}
                                    onChange={e => handleSettingChange('theme', 'primaryColor', e.target.value)}
                                    className="w-full h-10"
                                />
                            </div>
                            {/* Add more controls for fonts, etc. here */}
                            <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full">
                                {saveMutation.isPending ? 'Saving...' : 'Save Template'}
                            </Button>
                        </CardContent>
                    </Card>
                </aside>

                {/* --- Right Main Area: The Live Preview --- */}
                <div className="flex-grow">
                    <div className="aspect-[1/1.414] bg-white shadow-lg border">
                        {/* We render the template inside an iframe for style isolation, or directly */}
                        <iframe
                            srcDoc={invoiceHtml}
                            className="w-full h-full border-0"
                            title="Invoice Preview"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { id } = ctx.params as { id: string };
    let template: InvoiceTemplateDefinition | null = null;
    let isCustomTemplate = false;

    // Check if the ID is a number (custom template) or string (pre-defined)
    if (!isNaN(Number(id))) {
        // It's a custom template, fetch it from the DB
        isCustomTemplate = true;
        const supabase = createPagesServerClient(ctx);
        const { data } = await supabase.from('invoice_templates').select('*').eq('id', id).single();
        template = data as InvoiceTemplateDefinition;
    } else {
        // It's a pre-defined template, find it in our local array
        isCustomTemplate = false;
        // template = PREDEFINED_TEMPLATES.find(t => t.id === id) || null;
    }

    if (!template) {
        return { notFound: true };
    }

    return { props: { template, isCustomTemplate } };
};