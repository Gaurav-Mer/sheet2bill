/* eslint-disable react/no-unescaped-entities */
// pages/invoices/index.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/clients/Pagination'; // Reusing our component
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';

// Define the type for our Invoice data
type Invoice = {
    id: number;
    invoice_number: string;
    status: string;
    total: number;
    currency: string;
    clients: { name: string } | null;
    invoice_token?: string
};

type PageProps = {
    invoices: Invoice[];
    count: number;
    page: number;
    searchQuery: string;
};

const ITEMS_PER_PAGE = 15;

export default function InvoicesListPage({ invoices, count, page, searchQuery }: PageProps) {
    const router = useRouter();
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const refreshData = () => router.replace(router.asPath);

    // --- Mutations for Actions ---
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            const response = await fetch(`/api/invoices/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) throw new Error('Failed to update status');
            return response.json();
        },
        onSuccess: (data) => {
            toast.success(`Invoice marked as ${data.status}.`);
            refreshData();
        },
        onError: () => toast.error('Error updating status.'),
    });

    const deleteInvoiceMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete invoice');
        },
        onSuccess: () => {
            toast.success('Invoice deleted successfully.');
            setDeleteAlertOpen(false);
            refreshData();
        },
        onError: () => toast.error('Error deleting invoice. Only drafts can be deleted.'),
    });

    const handleOpenDelete = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setDeleteAlertOpen(true);
    };

    // Helper to get status badge colors
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // for 'draft'
        }
    }

    return (
        <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <p className="text-muted-foreground mt-2">Manage all your final invoices.</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8">
                <form className="w-full max-w-sm">
                    <Input type="search" name="q" placeholder="Search by invoice #..." defaultValue={searchQuery} />
                </form>
            </div>

            <div className="border border-border rounded-lg">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Invoice #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Total</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {invoices.length > 0 ? invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td className="px-6 py-4 font-medium text-primary">{invoice.invoice_number}</td>
                                <td className="px-6 py-4 text-muted-foreground">{invoice.clients?.name || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${getStatusClass(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-foreground">{invoice.currency} {invoice.total?.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                                            <DropdownMenuItem asChild>
                                                <a href={`/invoice/${invoice.invoice_token}`} target="_blank" rel="noopener noreferrer">View Public Page</a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                                    Download PDF
                                                </a>
                                            </DropdownMenuItem>                                            {invoice.status !== 'paid' && (
                                                <DropdownMenuItem onSelect={() => updateStatusMutation.mutate({ id: invoice.id, status: 'paid' })}>Mark as Paid</DropdownMenuItem>
                                            )}
                                            {invoice.status === 'paid' && (
                                                <DropdownMenuItem onSelect={() => updateStatusMutation.mutate({ id: invoice.id, status: 'sent' })}>Mark as Unpaid</DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            {invoice.status === 'draft' && (
                                                <DropdownMenuItem onSelect={() => handleOpenDelete(invoice)} className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">You haven't generated any invoices yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={page} totalPages={Math.ceil(count / ITEMS_PER_PAGE)} totalCount={count} searchQuery={searchQuery} basePath='/invoices' />

            <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
                    <DialogDescription>This will permanently delete invoice "{selectedInvoice?.invoice_number}". This action cannot be undone.</DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAlertOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => deleteInvoiceMutation.mutate(selectedInvoice!.id)} disabled={deleteInvoiceMutation.isPending}>
                            {deleteInvoiceMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };

    const searchQuery = ctx.query.q as string || '';
    const page = parseInt(ctx.query.page as string, 10) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    let query = supabase
        .from('invoices')
        .select('*, clients(name)', { count: 'exact' })
        .eq('user_id', session.user.id);

    if (searchQuery) {
        query = query.ilike('invoice_number', `%${searchQuery}%`);
    }

    query = query.order('created_at', { ascending: false }).range(startIndex, endIndex);

    const { data: invoices, error, count } = await query;

    if (error) console.error("Error fetching invoices:", error);

    return { props: { invoices: invoices || [], count: count || 0, page, searchQuery } };
};