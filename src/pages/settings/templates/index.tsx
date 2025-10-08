/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/settings/templates.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvoiceTemplateDefinition } from '@/types';

type PageProps = {
    customTemplates: InvoiceTemplateDefinition[];
};

// A simple component to render a preview of the template
const TemplatePreview = ({ settings }: { settings: any }) => (
    <div
        className="h-48 rounded-t-lg border-b flex flex-col p-4"
        style={{
            backgroundColor: settings.theme.backgroundColor,
            color: settings.theme.textColor
        }}
    >
        <h3 style={{ color: settings.theme.headingColor, fontWeight: 'bold' }}>Invoice</h3>
        <div className="w-full h-1 mt-2 rounded-full" style={{ backgroundColor: settings.theme.primaryColor }}></div>
    </div>
);

export default function TemplatesPage({ customTemplates }: PageProps) {
    const router = useRouter();

    return (
        <div className="container mx-auto mt-10 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Invoice Templates</h1>
                <p className="text-muted-foreground mt-2">Choose a style or manage your saved templates.</p>
            </div>

            {/* --- Section for Pre-defined Templates --- */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Choose a Style</h2>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PREDEFINED_TEMPLATES.map(template => (
                        <Card key={template.id} className="overflow-hidden">
                            <TemplatePreview settings={template.settings} />
                            <CardHeader>
                                <CardTitle>{template.name}</CardTitle>
                                <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="outline" onClick={() => router.push(`/settings/templates/${template.id}`)}>
                                    Customize
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div> */}
            </section>

            {/* --- Section for User's Custom Templates --- */}
            <section className="mt-12">
                <h2 className="text-2xl font-semibold mb-4">My Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customTemplates.length > 0 ? customTemplates.map(template => (
                        <Card key={template.id} className="overflow-hidden">
                            <TemplatePreview settings={template.settings} />
                            <CardHeader>
                                <CardTitle>{template.name}</CardTitle>
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                                <Button>Use Template</Button>
                                <Button variant="outline" onClick={() => alert('Editor page to be built next!')}>
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>
                    )) : (
                        <div className="col-span-full text-center py-16 bg-card border border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">No custom templates yet</h3>
                            <p className="text-muted-foreground mt-2">Customize a style to save it here.</p>
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

    // Fetch the user's own custom templates
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