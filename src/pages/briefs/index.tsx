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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    const queryClient = useQueryClient(); // NEW: Initialize query client for cache invalidation


    const refreshData = () => router.replace(router.asPath);

    const copyLink = (token: string) => {
        // CORRECTED: The path should be /brief/, not /briefs/
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

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case 'sent': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // for 'draft'
        }
    }

    // NEW: Mutation for converting a brief to an invoice
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
            // Invalidate briefs data and redirect to the new invoices page
            queryClient.invalidateQueries({ queryKey: ['briefs'] });
            router.push('/invoices');
        },
        onError: (error: Error) => {
            toast.error(`Error generating invoice: ${error.message}`);
        }
    });

    // --- NEW: Mutation for duplicating a brief ---
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
            // Redirect to the edit page of the NEW brief
            router.push(`/briefs/${data.newBriefId}/edit`);
        },
        onError: (error: Error) => toast.error(`Error duplicating brief: ${error.message}`),
    });


    const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
    return (
        <div className="container mx-auto  max-w-7xl">
            {/* ... Header and Search sections are the same ... */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Briefs</h1>
                    <p className="text-muted-foreground mt-2">Manage all your briefs and track their status.</p>
                </div>
                <Link href="/briefs/new" passHref>
                    <Button>+ Create New Brief</Button>
                </Link>
            </div>

            <div className="flex justify-between items-center mb-8">
                <form className="w-full max-w-sm flex items-center gap-0">
                    <Input type="search" name="q" placeholder="Search by title or brief name..." className='rounded-r-none' defaultValue={searchQuery} />
                    <Button className='rounded-l-none'> Search</Button>
                </form>
            </div>


            {/* Briefs Table */}
            <div className="border border-border rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                    <thead className="bg-muted/50"><tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Brief #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr></thead>
                    <tbody className="bg-card divide-y divide-border">
                        {briefs.length > 0 ? briefs.map(brief => (
                            <tr key={brief.id}>
                                <td className="px-6 py-4 font-medium text-primary hover:underline"><Link href={`/briefs/${brief.id}/edit`}>{brief.brief_number}</Link></td>
                                <td className="px-6 py-4 text-muted-foreground">{brief.title}</td>
                                <td className="px-6 py-4 text-muted-foreground">{brief.clients?.name || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${getStatusClass(brief.status)}`}>
                                        {brief.status === 'rejected' ? 'Changes Requested' : brief.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-foreground">{brief.currency} {brief.total?.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {brief.status === 'approved' && (
                                                <DropdownMenuItem
                                                    onSelect={() => convertToInvoiceMutation.mutate(brief.id)}
                                                    disabled={convertToInvoiceMutation.isPending}
                                                    className="font-semibold text-primary focus:text-primary"
                                                >
                                                    {convertToInvoiceMutation.isPending ? 'Generating...' : 'Generate Invoice'}
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onSelect={() => {
                                                router.push(`/brief/${brief.brief_token}`)
                                            }}>View Public Page</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => copyLink(brief.brief_token)}>Copy Approval Link</DropdownMenuItem>
                                            {(brief.status === 'draft' || brief.status === 'rejected') && (
                                                <DropdownMenuItem onSelect={() => router.push(`/briefs/${brief.id}/edit`)}>Edit</DropdownMenuItem>
                                            )}

                                            {/* --- THIS IS THE NEW DUPLICATE BUTTON --- */}
                                            <DropdownMenuItem onSelect={() => duplicateBriefMutation.mutate(brief.id)} disabled={duplicateBriefMutation.isPending}>
                                                {duplicateBriefMutation.isPending ? 'Duplicating...' : 'Duplicate'}
                                            </DropdownMenuItem>

                                            {brief.status === 'draft' && (
                                                <DropdownMenuItem onSelect={() => handleOpenDelete(brief)} className="text-destructive">Delete</DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        )) : (<tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                                <div className='flex items-center justify-center gap-3 h-full flex-col'>
                                    <div className='h-20 w-20 p-0 rounded-full bg-primary/10'>
                                        <svg width="full" height="full" viewBox="-20 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M85.026 147.824L38.993 139.907L48.192 61.333L113.247 70.443L106.255 132.11L85.026 147.824ZM52.773 67.716L45.444 135.191L80.261 141.573L83.01 124.249L101.335 126.064L106.832 75.002L52.773 67.716ZM58.177 85.479L58.702 79.019L99.806 85.163L98.652 90.666L58.177 85.479ZM95.821 104.161L57.127 98.377L57.583 92.763L97.148 97.833L95.821 104.161ZM78.416 113.773L56.011 112.107L56.532 105.703L80.25 108.253L78.416 113.773Z" fill="#000000" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-center text-black/50 mt-1">  You haven't created any briefs yet.</p>
                                </div>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* <Pagination currentPage={page} totalPages={Math.ceil(count / ITEMS_PER_PAGE)} totalCount={count} searchQuery={searchQuery} /> */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalCount={count}
                searchQuery={searchQuery}
                basePath="/briefs"
                itemPerPage={ITEMS_PER_PAGE}
            />
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
                    <DialogDescription>This action cannot be undone. This will permanently delete brief "{selectedBrief?.brief_number}".</DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAlertOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteBrief}>Yes, Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// getServerSideProps remains the same
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