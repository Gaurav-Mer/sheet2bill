/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/briefs/[id]/edit.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
// Import our reusable form and types
import { BriefForm } from '@/components/briefs/BriefForm';
import { Client, Brief, LineItem } from '@/types';

type EditPageProps = {
    clients: Client[];
    brief: Brief & { line_items: LineItem[] };
    items?: any[];
};

export default function Index({ clients, brief, items }: EditPageProps) {
    const router = useRouter();

    const editBriefMutation = useMutation({
        mutationFn: async (updatedBrief: any) => {
            console.log("updatedBrief", updatedBrief)
            const response = await fetch(`/api/briefs/${brief.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBrief),
            });
            if (!response.ok) throw new Error('Failed to update brief');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Brief updated successfully!');
            router.push('/briefs'); // Redirect to the briefs list
        },
        onError: () => toast.error('Error updating brief.'),
    });

    return (
        <BriefForm
            clients={clients}
            initialData={brief}
            onSubmit={editBriefMutation.mutate}
            submitButtonText={editBriefMutation.isPending ? 'Saving...' : 'Save Changes'}
            isSubmitting={editBriefMutation.isPending}
            items={items}
        />
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();


    if (!user || authError) {
        return {
            redirect: {
                destination: '/login', // or your login page route
                permanent: false,
            },
        };
    }
    const { id } = ctx.params as { id: string };
    // Fetch the specific brief to edit
    const { data: brief } = await supabase
        .from('briefs')
        .select('*, line_items(*)')
        .eq('id', id)
        .single();

    // 2.  Fetch Items
    const { data: items } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

    // Also fetch all clients for the dropdown
    const { data: clients } = await supabase.from('clients').select('id, name');
    if (!brief) {
        return { notFound: true };
    }

    return {
        props: {
            brief,
            clients: clients || [],
            items: items || [],
        },
    };
};