/* eslint-disable react/no-unescaped-entities */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/clients/Pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';

type Invoice = {
    id: number;
    invoice_number: string;
    status: string;
    total: number;
    currency: string;
    clients: { name: string } | null;
    invoice_token?: string;
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

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
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

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'sent':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="container mx-auto max-w-7xl px-2 sm:px-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Invoices</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage all your final invoices.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
                <form className="w-full sm:max-w-sm">
                    <Input type="search" name="q" placeholder="Search by invoice #..." defaultValue={searchQuery} />
                </form>
            </div>

            {/* Responsive Table / Cards */}
            <div className="hidden sm:block border border-border rounded-lg overflow-x-auto">
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
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="px-6 py-4 font-medium text-primary">{invoice.invoice_number}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{invoice.clients?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${getStatusClass(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-foreground">
                                        {invoice.currency} {invoice.total?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <a href={`/invoice/${invoice.invoice_token}`} target="_blank" rel="noopener noreferrer">
                                                        View Public Page
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                                        Download PDF
                                                    </a>
                                                </DropdownMenuItem>
                                                {invoice.status !== 'paid' && (
                                                    <DropdownMenuItem onSelect={() => updateStatusMutation.mutate({ id: invoice.id, status: 'paid' })}>
                                                        Mark as Paid
                                                    </DropdownMenuItem>
                                                )}
                                                {invoice.status === 'paid' && (
                                                    <DropdownMenuItem onSelect={() => updateStatusMutation.mutate({ id: invoice.id, status: 'sent' })}>
                                                        Mark as Unpaid
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                {invoice.status === 'draft' && (
                                                    <DropdownMenuItem
                                                        onSelect={() => handleOpenDelete(invoice)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                                    <div className='flex items-center justify-center gap-3 h-full flex-col'>
                                        <div className='h-20 w-20 p-4 rounded-full bg-primary/10'>
                                            <svg fill="#000000" height="full" width="full" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                                viewBox="0 0 511.997 511.997" xmlSpace="preserve">
                                                <g>
                                                    <g>
                                                        <path d="M506.747,0.662c-3.191-1.323-6.869-0.614-9.318,1.843l-28.1,28.1l-28.1-28.1c-3.336-3.336-8.729-3.336-12.066,0
			l-28.1,28.1l-28.1-28.1c-3.336-3.336-8.729-3.336-12.066,0l-28.1,28.1l-28.1-28.1c-3.336-3.336-8.729-3.336-12.066,0l-28.1,28.1
			l-28.1-28.1c-2.449-2.44-6.118-3.183-9.301-1.852c-3.183,1.314-5.265,4.429-5.265,7.885c0,185.187-15.112,291.374-46.165,324.261
			H8.537c-2.466,0-4.813,1.067-6.434,2.927c-1.621,1.869-2.355,4.335-2.022,6.775c11.477,82.866,33.604,167.805,110.855,169.495
			h273.062c0.026,0,0.06,0,0.094,0c116.785-0.905,127.426-385.555,127.904-503.424C512.012,5.108,509.938,1.985,506.747,0.662z
			 M111.123,494.93c-49.552-1.075-77.516-44.603-92.73-145.064h160.782c0.009-0.009,0.034-0.009,0.051,0h94.966
			c8.584,58.649,23.159,117.067,59.485,145.064H111.123z M384.185,494.93c-0.009,0-0.017,0-0.026,0
			c-51.097-1.126-79.239-47.419-94.104-154.766c-0.589-4.224-4.19-7.364-8.456-7.364h-84.598
			c27.4-43.511,40.84-141.506,41.872-303.73l19.626,19.635c3.336,3.336,8.729,3.336,12.066,0l28.1-28.1l28.1,28.1
			c3.336,3.336,8.729,3.336,12.066,0l28.1-28.1l28.1,28.1c3.336,3.336,8.729,3.336,12.066,0l28.1-28.1l28.1,28.1
			c3.336,3.336,8.729,3.336,12.066,0l19.396-19.396C491.925,264.031,457.092,494.393,384.185,494.93z"/>
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="M452.263,85.337H273.066c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h179.197
			c4.71,0,8.533-3.823,8.533-8.533S456.973,85.337,452.263,85.337z"/>
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="M452.263,128.003H273.066c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h179.197
			c4.71,0,8.533-3.823,8.533-8.533S456.973,128.003,452.263,128.003z"/>
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="M452.263,170.669H273.066c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h179.197
			c4.71,0,8.533-3.823,8.533-8.533S456.973,170.669,452.263,170.669z"/>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                        <p className="text-xs text-center text-black/50 mt-1">   You haven't generated any invoices yet.</p>

                                    </div>

                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
                {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                        <div key={invoice.id} className="border border-border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-primary">{invoice.invoice_number}</h2>
                                <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${getStatusClass(invoice.status)}`}>
                                    {invoice.status}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{invoice.clients?.name || 'N/A'}</p>
                            <p className="text-sm mt-2 font-medium">
                                Total: {invoice.currency} {invoice.total?.toFixed(2)}
                            </p>
                            <div className="mt-3 flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <a href={`/invoice/${invoice.invoice_token}`} target="_blank" rel="noopener noreferrer">
                                                View Page
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                                Download PDF
                                            </a>
                                        </DropdownMenuItem>
                                        {invoice.status !== 'paid' && (
                                            <DropdownMenuItem onSelect={() => updateStatusMutation.mutate({ id: invoice.id, status: 'paid' })}>
                                                Mark as Paid
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {invoice.status === 'draft' && (
                                            <DropdownMenuItem onSelect={() => handleOpenDelete(invoice)} className="text-destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-6 text-sm">You haven't generated any invoices yet.</p>
                )}
            </div>

            <Pagination currentPage={page} totalPages={Math.ceil(count / ITEMS_PER_PAGE)} totalCount={count} searchQuery={searchQuery} basePath="/invoices" />

            <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        This will permanently delete invoice "{selectedInvoice?.invoice_number}". This action cannot be undone.
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAlertOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteInvoiceMutation.mutate(selectedInvoice!.id)}
                            disabled={deleteInvoiceMutation.isPending}
                        >
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

    const searchQuery = (ctx.query.q as string) || '';
    const page = parseInt(ctx.query.page as string, 10) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    let query = supabase
        .from('invoices')
        .select('*, clients(name)', { count: 'exact' })
        .eq('user_id', session.user.id);

    if (searchQuery) query = query.ilike('invoice_number', `%${searchQuery}%`);

    query = query.order('created_at', { ascending: false }).range(startIndex, endIndex);

    const { data: invoices, error, count } = await query;

    if (error) console.error('Error fetching invoices:', error);

    return { props: { invoices: invoices || [], count: count || 0, page, searchQuery } };
};
