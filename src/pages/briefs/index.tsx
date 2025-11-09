/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// pages/briefs/index.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';
// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/clients/Pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BriefsList } from '@/components/briefs/BriefsList';
import { Search } from 'lucide-react';

type Brief = {
    id: number;
    brief_number: string;
    title: string;
    status: string;
    total: number;
    currency: string;
    brief_token: string;
    clients: { name: string } | null;
};

type PageProps = {
    briefs: Brief[];
    count: number;
    page: number;
    searchQuery: string;
};

const ITEMS_PER_PAGE = 10;

export default function BriefsListPage({ briefs, count, page, searchQuery }: PageProps) {
    const router = useRouter();
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
    const queryClient = useQueryClient();

    const refreshData = () => router.replace(router.asPath);

    const copyLink = (token: string) => {
        const url = `${window.location.origin}/brief/${token}`;
        navigator.clipboard.writeText(url);
        toast.success('Approval link copied to clipboard!');
    };

    const handleOpenDelete = (brief: Brief) => {
        setSelectedBrief(brief);
        setDeleteAlertOpen(true);
    };

    async function handleDeleteBrief() {
        if (!selectedBrief) return;
        const res = await fetch(`/api/briefs/${selectedBrief.id}`, { method: 'DELETE' });
        if (res.status !== 204) {
            const errorData = await res.json();
            toast.error(`Error deleting brief: ${errorData.message}`);
            return;
        }
        toast.success('Brief deleted successfully.');
        setDeleteAlertOpen(false);
        refreshData();
    }

    // Mutation for converting a brief to an invoice
    const convertToInvoiceMutation = useMutation({
        mutationFn: async (brief_id: number) => {
            const response = await fetch('/api/invoices/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brief_id }),
            });
            if (!response.ok) throw new Error('Failed to generate invoice');
            return response.json();
        },
        onSuccess: (newInvoice: any) => {
            toast.success(`Invoice #${newInvoice.invoice_number} generated!`);
            queryClient.invalidateQueries({ queryKey: ['briefs'] });
            router.push('/invoices');
        },
        onError: (error: Error) => {
            toast.error(`Error generating invoice: ${error.message}`);
        }
    });

    // Mutation for duplicating a brief
    const duplicateBriefMutation = useMutation({
        mutationFn: async (brief_id: number) => {
            const response = await fetch(`/api/briefs/${brief_id}/duplicate`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to duplicate brief');
            return response.json();
        },
        onSuccess: (data) => {
            toast.success('Brief duplicated successfully!');
            router.push(`/briefs/${data.newBriefId}/edit`);
        },
        onError: (error: Error) => toast.error(`Error duplicating brief: ${error.message}`),
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Briefs</h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                        Manage all your briefs and track their status.
                    </p>
                </div>
                <Link className='hidden md:block' href="/briefs/new" passHref>
                    <Button className="w-full md:w-auto">+ Create New Brief</Button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6 md:mb-8">
                <form className="flex items-center gap-0 max-w-full md:max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            name="q"
                            placeholder="Search briefs..."
                            className="rounded-r-none pl-9"
                            defaultValue={searchQuery}
                        />
                    </div>
                    <Button type="submit" className="rounded-l-none">
                        Search
                    </Button>
                </form>
            </div>

            {/* Briefs List Component */}
            <BriefsList
                briefs={briefs}
                searchQuery={searchQuery}
                onCopyLink={copyLink}
                onDelete={handleOpenDelete}
                onConvertToInvoice={(id) => convertToInvoiceMutation.mutate(id)}
                onDuplicate={(id) => duplicateBriefMutation.mutate(id)}
                isConverting={convertToInvoiceMutation.isPending}
                isDuplicating={duplicateBriefMutation.isPending}
                isDeleteAlertOpen={isDeleteAlertOpen}
            />

            {/* Pagination */}
            {briefs.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalCount={count}
                        searchQuery={searchQuery}
                        basePath="/briefs"
                        itemPerPage={ITEMS_PER_PAGE}
                    />
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete brief "
                        {selectedBrief?.brief_number}".
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAlertOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteBrief}>
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className=' fixed bottom-0 left-0 md:hidden w-full p-4  bg-background border-t'>
                <Link href="/briefs/new" passHref>
                    <Button className="w-full md:w-auto">+ Create New Brief</Button>
                </Link>
            </div>
        </div>
    );
}

// getServerSideProps
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };

    const searchQuery = ctx.query.q as string || '';
    const page = parseInt(ctx.query.page as string, 10) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    // Build the query to fetch briefs and their related client names
    let query = supabase
        .from('briefs')
        .select('id, brief_number, title, status, total, currency, brief_token, clients(name)', { count: 'exact' })
        .eq('user_id', session.user.id);

    if (searchQuery) {
        // Note: Searching on a joined table (clients.name) is more complex.
        // For now, we'll search on the brief's title.
        query = query.ilike('title', `%${searchQuery}%`);
    }

    query = query.order('created_at', { ascending: false }).range(startIndex, endIndex);

    const { data: briefs, error, count } = await query;

    if (error) console.error("Error fetching briefs:", error);

    return { props: { briefs: briefs || [], count: count || 0, page, searchQuery } };
};