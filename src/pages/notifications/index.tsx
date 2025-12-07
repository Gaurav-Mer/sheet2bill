/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { createPagesServerClient, createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/clients/Pagination';
import RenderTime from '@/components/RenderTime';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Define the shape of a notification
type Notification = {
    id: string;
    message: string;
    created_at: string;
    link_to: string | null;
    is_read: boolean;
    user_id: string;
};

export default function NotificationsPage({ initialNotifications, count, page, searchQuery, userId }: any) {
    // Create a Supabase client for the browser
    const [supabase] = useState(() => createPagesBrowserClient());
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const queryClient = useQueryClient();
    const ITEMS_PER_PAGE = 20;

    // 1. Client-side Fetcher (used when refetching after delete)
    const fetchNotifications = async () => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

        if (error) throw error;
        return data as Notification[];
    };

    // 2. TanStack Query Hook
    // We pass 'initialNotifications' from SSR so the first render is instant.
    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', page, userId],
        queryFn: fetchNotifications,
        initialData: initialNotifications,
        refetchOnWindowFocus: false,
    });

    // 3. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return id;
        },
        onSuccess: (deletedId) => {
            toast.success('Notification deleted');

            // A. Update the list UI immediately (Optimistic-ish update)
            queryClient.setQueryData(['notifications', page, userId], (oldData: Notification[] | undefined) => {
                if (!oldData) return [];
                return oldData.filter((n) => n.id !== deletedId);
            });

            // B. Close the dialog
            setSelectedNotification(null);

            // C. Invalidate queries to ensure data consistency with server
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (err) => {
            console.error(err);
            toast.error('Failed to delete notification');
        }
    });

    const handleDeleteClick = (e: React.MouseEvent, data: Notification) => {
        e.preventDefault(); // Stop link navigation
        e.stopPropagation(); // Stop bubble
        setSelectedNotification(data);
    };

    const totalPages = Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));

    return (
        <div className="max-w-4xl p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">All Notifications</h1>
                <p className="text-muted-foreground mt-2">
                    A complete history of your account activity.
                </p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {isLoading ? (
                            <div className="p-10 flex justify-center">
                                <Loader2 className="animate-spin text-muted-foreground" />
                            </div>
                        ) : notifications && notifications.length > 0 ? (
                            notifications.map((notif: Notification) => {
                                // Check if this specific item is being deleted (for row loading state if needed)
                                const isDeleting = deleteMutation.isPending && deleteMutation.variables === notif.id;

                                return (
                                    <div
                                        key={notif.id}
                                        className={`group relative flex items-start gap-4 p-4 hover:bg-muted/50 transition ${!notif.is_read ? 'bg-primary/5' : ''}`}
                                    >
                                        <Link href={notif.link_to || '#'} className="flex-grow flex items-start gap-4 pr-10">
                                            {!notif.is_read && (
                                                <div className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0" />
                                            )}
                                            <div className={`flex-grow ${!notif.is_read ? '' : 'pl-4'}`}>
                                                <p className="text-sm font-medium text-gray-900">{notif.message?.toString()}</p>
                                                <div className="mt-1">
                                                    <RenderTime time={notif.created_at} />
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Delete Button (Visible on Hover) */}
                                        <button
                                            onClick={(e) => handleDeleteClick(e, notif)}
                                            disabled={deleteMutation.isPending}
                                            className="absolute right-4 top-4 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                            title="Delete"
                                        >
                                            {isDeleting ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="p-10 text-center text-muted-foreground">
                                You have no notifications yet.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalCount={count}
                    searchQuery={searchQuery}
                    basePath="/notifications"
                    itemPerPage={ITEMS_PER_PAGE}
                />
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!selectedNotification}
                onOpenChange={(open) => !open && setSelectedNotification(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the notification: <br />
                            <span className="font-medium text-foreground">
                                &quot;{selectedNotification?.message ? (
                                    selectedNotification.message.length > 50
                                        ? `${selectedNotification.message.substring(0, 50)}...`
                                        : selectedNotification.message
                                ) : 'Selected Item'}&quot;
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedNotification(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedNotification && deleteMutation.mutate(selectedNotification.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) {
        return { redirect: { destination: '/login', permanent: false } };
    }

    const page = parseInt(ctx.query.page as string, 10) || 1;
    const ITEMS_PER_PAGE = 20;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const searchQuery = ctx.query.q as string || '';

    // Fetch data server-side for initial render
    const { data: notifications, count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

    if (error) console.error('Error fetching notifications page:', error);

    return {
        props: {
            initialNotifications: notifications || [], // Passed to initialData
            count: count || 0,
            page,
            searchQuery,
            userId: user.id // Needed for client-side query key
        },
    };
};