/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvoiceTemplateDefinition } from '@/types';
import { AVAILABLE_TEMPLATES } from '@/lib/templates';

type PageProps = {
    customTemplates: InvoiceTemplateDefinition[];
};

// A simple component to render a visual preview of the template's theme
const TemplatePreview = ({ settings }: { settings: any }) => (
    <div
        className="h-40 rounded-t-lg border-b p-4 flex flex-col justify-between"
        style={{
            backgroundColor: settings?.theme?.backgroundColor,
            color: settings?.theme?.textColor
        }}
    >
        <h3 style={{ color: settings.theme?.headingColor, fontWeight: 'bold', fontSize: '24px' }}>Invoice</h3>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: settings?.theme?.primaryColor }}></div>
    </div>
);

export default function TemplatesPage({ customTemplates }: PageProps) {
    const router = useRouter();

    return (
        <div className="container mx-auto mt-10 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Invoice Templates</h1>
                <p className="text-muted-foreground mt-2">Choose a professional style for your invoices or manage your saved templates.</p>
            </div>

            <section>
                <h2 className="text-2xl font-semibold mb-4 tracking-tight">Choose a Style</h2>
                <p className="text-muted-foreground mb-6">Select a pre-defined template to customize and make your own.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_TEMPLATES.map(template => (
                        <Card key={template.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <TemplatePreview settings={template.settings} />
                            <CardHeader>
                                <CardTitle>{template.name}</CardTitle>
                                <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                {/* This will link to the editor page we build next */}
                                <Button variant="outline" onClick={() => router.push(`/settings/templates/${template.id}`)}>
                                    Customize
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mt-12">
                <h2 className="text-2xl font-semibold mb-4 tracking-tight">My Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customTemplates.length > 0 ? customTemplates.map(template => (
                        <Card key={template.id} className="overflow-hidden shadow-sm">
                            <TemplatePreview settings={template.settings} />
                            <CardHeader>
                                <CardTitle>{template.name}</CardTitle>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="outline" onClick={() => router.push(`/settings/templates/${template.id}`)}>
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>
                    )) : (
                        <div className="col-span-full text-center py-16 bg-card border border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">No custom templates yet</h3>
                            <p className="text-muted-foreground mt-2">Customize a pre-defined style to save it here.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };

    // Fetch the user's own custom templates from the database
    const { data: customTemplates } = await supabase
        .from('invoice_templates')
        .select('*')
        .eq('user_id', session.user.id);

    return {
        props: {
            customTemplates: customTemplates || [],
        },
    };
};