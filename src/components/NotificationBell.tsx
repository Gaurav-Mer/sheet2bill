/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/NotificationBell.tsx
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Link from 'next/link';
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// A simple helper function to format dates as "time ago"
function timeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

export const NotificationBell = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            // CORRECTED: URL is plural
            const res = await fetch('/api/notification');
            if (!res.ok) throw new Error('Failed to fetch notifications');
            return res.json();
        },
        // Optional: Refetch every 60 seconds
        refetchInterval: 60000,
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => fetch('/api/notification/read', { method: 'PATCH' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const markOneAsReadMutation = useMutation({
        mutationFn: (id: number) => fetch('/api/notification/read', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification_id: id }),
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const unreadCount = data?.unreadCount || 0;
    const recentNotifications = data?.notifications?.slice(0, 5) || [];

    const handleNotificationClick = (notif: any) => {
        if (!notif.is_read) {
            markOneAsReadMutation.mutate(notif.id);
        }
        router.push(notif.link_to || '#');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
                <div className="flex justify-between items-center p-2">
                    <DropdownMenuLabel className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && <Button variant="link" size="sm" className="h-auto p-0" onClick={() => markAllAsReadMutation.mutate()}>Mark all as read</Button>}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                    {recentNotifications.length > 0 ? (
                        recentNotifications.map((notif: any) => (
                            <DropdownMenuItem key={notif.id} onSelect={() => handleNotificationClick(notif)} className={`flex items-start gap-3 !p-2 cursor-pointer ${!notif.is_read ? 'bg-primary/5' : ''}`}>
                                {!notif.is_read && <div className="h-2 w-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />}
                                <div className={`flex-shrink-0 mt-1 ${!notif.is_read ? '' : 'pl-5'}`}>
                                    {notif.message.includes('approved') ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm whitespace-normal font-medium">{notif.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{timeAgo(notif.created_at)}</p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <p className="p-4 text-sm text-muted-foreground text-center">You're all caught up!</p>
                    )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/notifications" className="flex items-center justify-center !py-2 text-sm">View All Notifications</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}