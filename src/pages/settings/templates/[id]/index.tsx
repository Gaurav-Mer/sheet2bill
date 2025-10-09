// pages/settings/templates/[id].tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { renderToStaticMarkup } from 'react-dom/server';

import { InvoiceTemplateDefinition, TemplateSettings } from '@/types';
import { AVAILABLE_TEMPLATES } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleInvoiceData } from '@/lib/sample-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrentTemplate } from '@/components/templates/CurrentTemplate';

type PageProps = {
    template: InvoiceTemplateDefinition;
    isCustomTemplate: boolean;
    id: string
};

export default function TemplateEditorPage({ template, isCustomTemplate, id }: PageProps) {
    const router = useRouter();
    const [name, setName] = useState(isCustomTemplate ? template.name : `Copy of ${template.name}`);
    const [settings, setSettings] = useState<TemplateSettings>(template.settings);
    const handleSettingChange = (section: keyof TemplateSettings, key: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: value },
        }));
    };

    // Generate the full HTML for the iframe preview
    const invoiceHtml = renderToStaticMarkup(
        <CurrentTemplate templateId={id} data={{ ...sampleInvoiceData, settings }} />
    );

    const saveMutation = useMutation({
        mutationFn: async (payload: { name: string; settings: TemplateSettings }) => {
            const isUpdating = isCustomTemplate;
            const url = isUpdating ? `/api/templates/${template.id}` : '/api/templates';
            const method = isUpdating ? 'PUT' : 'POST';

            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error('Failed to save template');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Template saved successfully!');
            router.push('/settings/templates');
        },
        onError: () => toast.error('Error saving template.'),
    });

    return (
        <div className="container mx-auto mt-10 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Template Editor</h1>
                    <p className="text-muted-foreground mt-2">Customize the design and save it as your own.</p>
                </div>
                <Button onClick={() => saveMutation.mutate({ name, settings })} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? 'Saving...' : 'Save Template'}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* --- Editor Controls --- */}
                <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
                    <Card>
                        <CardHeader><CardTitle>Customize</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div><Label htmlFor="templateName">Template Name</Label><Input id="templateName" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div><Label htmlFor="primaryColor">Primary Color</Label><Input id="primaryColor" type="color" value={settings?.theme?.primaryColor} onChange={e => handleSettingChange('theme', 'primaryColor', e.target.value)} className="w-full h-10 p-1" /></div>
                            <div><Label htmlFor="headingColor">Heading Color</Label><Input id="headingColor" type="color" value={settings?.theme?.headingColor} onChange={e => handleSettingChange('theme', 'headingColor', e.target.value)} className="w-full h-10 p-1" /></div>
                            <div>
                                <Label htmlFor="fontFamily">Font</Label>
                                <Select defaultValue={settings?.typography?.fontFamily} onValueChange={value => handleSettingChange('typography', 'fontFamily', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="'Inter', sans-serif">Inter (Modern)</SelectItem>
                                        <SelectItem value="'Georgia', serif">Georgia (Classic)</SelectItem>
                                        <SelectItem value="'Lato', sans-serif">Lato (Elegant)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* --- Live Preview --- */}
                <div className="flex-grow">
                    <div className="aspect-[1/1.414] h-full shadow-lg border rounded-lg overflow-hidden">
                        <iframe srcDoc={invoiceHtml} className="w-full h-full border-0" title="Invoice Preview" />
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

    if (!isNaN(Number(id))) {
        isCustomTemplate = true;
        const supabase = createPagesServerClient(ctx);
        const { data } = await supabase.from('invoice_templates').select('*').eq('id', id).single();
        template = data as InvoiceTemplateDefinition;
    } else {
        isCustomTemplate = false;
        template = AVAILABLE_TEMPLATES.find(t => t.id === id) || null;
    }

    if (!template) {
        return { notFound: true };
    }

    return { props: { template, isCustomTemplate, id } };
};