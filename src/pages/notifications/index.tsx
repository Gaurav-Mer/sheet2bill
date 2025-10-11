/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/clients/Pagination';
import RenderTime from '@/components/RenderTime';

export default function NotificationsPage({ notifications, count, page, searchQuery }: any) {
    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));
    return (
        <div className="max-w-4xl ">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">All Notifications</h1>
                <p className="text-muted-foreground mt-2">
                    A complete history of your account activity.
                </p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {notifications.length > 0 ? (
                            notifications.map((notif: any) => (
                                <Link key={notif.id} href={notif.link_to || '#'} passHref>
                                    <div
                                        className={`p-4 flex items-start gap-4 hover:bg-muted/50 transition ${!notif.is_read ? 'bg-primary/5' : ''
                                            }`}
                                    >
                                        {!notif.is_read && (
                                            <div className="h-2 w-2 mt-1.5 rounded-full bg-primary" />
                                        )}
                                        <div className={`flex-grow ${!notif.is_read ? '' : 'pl-4'}`}>
                                            <p className="text-sm font-medium">{notif.message}</p>
                                            <RenderTime time={notif.created_at} />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="p-10 text-center text-muted-foreground">
                                You have no notifications yet.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalCount={count}
                searchQuery={searchQuery}
                basePath="/notifications"
                itemPerPage={ITEMS_PER_PAGE}
            />
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };

    const page = parseInt(ctx.query.page as string, 10) || 1;
    const ITEMS_PER_PAGE = 20;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const searchQuery = ctx.query.q as string || '';


    const { data: notifications, count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

    if (error) console.error('Error fetching notifications page:', error);

    return {
        props: {
            notifications: notifications || [],
            count: count || 0,
            page,
            searchQuery
        },
    };
};
