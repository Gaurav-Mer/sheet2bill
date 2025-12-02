/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/clients/Pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type Item = {
    id: number;
    name: string;
    description: string | null;
    default_price: number;
};

type PageProps = {
    items: Item[];
    count: number;
    page: number;
    searchQuery: string;
};

const ITEMS_PER_PAGE = 20;

export default function ItemsPage({ items, count, page, searchQuery }: PageProps) {
    const router = useRouter();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const refreshData = () => router.replace(router.asPath);

    const handleOpenEdit = (item: Item) => {
        setSelectedItem(item);
        setIsFormModalOpen(true);
    };

    const handleOpenDelete = (item: Item) => {
        setSelectedItem(item);
        setDeleteAlertOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormModalOpen(false);
        setSelectedItem(null); // Clear selected item on close
    };

    // Mutation for creating or updating an item
    const itemFormMutation = useMutation({
        mutationFn: async (formData: any) => {
            const isEditing = !!selectedItem;
            const url = isEditing ? `/api/items/${selectedItem.id}` : '/api/items';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error(await response.json().then(d => d.message));
        },
        onSuccess: () => {
            toast.success(selectedItem ? 'Item updated successfully!' : 'Item added successfully!');
            handleCloseForm();
            refreshData();
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const handleDeleteItem = useMutation({
        mutationFn: async (itemId: number) => {
            const response = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
            const errorData = await response.json().catch(() => null);
            if (!response.ok) throw new Error(errorData?.message ?? 'Failed to delete item');
        },
        onSuccess: () => {
            toast.success('Item deleted successfully.');
            setDeleteAlertOpen(false);
            refreshData();
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        itemFormMutation.mutate(data);
    };

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto max-w-6xl">
            {/* --- Header --- */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Items & Services</h1>
                    <p className="text-muted-foreground mt-2">Manage your reusable line items.</p>
                </div>
                <Button onClick={() => {
                    setIsFormModalOpen(true)
                    setSelectedItem(null)
                }
                }>+ Add New Item</Button>
            </div>

            {/* --- Search Bar --- */}
            <div className="flex justify-between items-center mb-8">
                <form className="w-full max-w-sm flex items-center gap-0">
                    <Input type="search" name="q" placeholder="Search by name..." className='rounded-r-none' defaultValue={searchQuery} />
                    <Button type="submit" className='rounded-l-none'>Search</Button>
                </form>
            </div>

            {/* --- Items Table --- */}
            <div className="border border-border rounded-lg">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Default Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {items.length > 0 ? items.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{item.description}</td>
                                <td className="px-6 py-4 text-right text-muted-foreground">₹{item.default_price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => handleOpenEdit(item)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleOpenDelete(item)} className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">You haven&apos;t added any items yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Pagination --- */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalCount={count}
                    searchQuery={searchQuery}
                    basePath="/items"
                />
            )}

            {/* --- Add/Edit Modal --- */}
            <Dialog open={isFormModalOpen} onOpenChange={handleCloseForm}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="name">Item Name</Label>
                            <Input id="name" name="name" defaultValue={selectedItem?.name} required />
                        </div>
                        <div>
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input maxLength={100} id="description" name="description" defaultValue={selectedItem?.description || ''} />
                        </div>
                        <div>
                            <Label htmlFor="default_price">Default Price</Label>
                            <Input id="default_price" name="default_price" type="number" step="0.01" defaultValue={selectedItem?.default_price || 0} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseForm}>Cancel</Button>
                            <Button type="submit" disabled={itemFormMutation.isPending}>
                                {itemFormMutation.isPending ? 'Saving...' : 'Save Item'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- Delete Confirmation Dialog --- */}
            <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
                    <DialogDescription>This action cannot be undone. This will permanently delete the item &quot;{selectedItem?.name}&quot;.</DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAlertOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteItem.mutate(selectedItem!.id)} disabled={handleDeleteItem.isPending}>
                            {handleDeleteItem.isPending ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- Server-Side Data Fetching ---
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };

    const page = parseInt(ctx.query.page as string, 10) || 1;
    const searchQuery = ctx.query.q as string || '';
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    let query = supabase
        .from('items')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

    if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data: items, error, count } = await query
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);

    if (error) {
        console.error("Error fetching items:", error);
    }

    return {
        props: {
            items: items || [],
            count: count || 0,
            page,
            searchQuery
        },
    };
};