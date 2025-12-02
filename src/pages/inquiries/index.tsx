/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { format, formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { Inbox, ArrowRight, Clock, CheckCircle2, XCircle, Mail, Trash2Icon } from 'lucide-react'
import { InquiryReviewModal } from '@/components/inquery/InquiryReviewModal'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router';

// --- Types ---
export interface Inquiry {
    id: string
    client_name: string
    client_email: string
    message: string
    start_date: string
    end_date: string
    requested_items: {
        id: string
        name: string
        price: number
        currency: string
    }[]
    status: 'pending' | 'accepted' | 'rejected'
    created_at: string
}

interface InquiriesPageProps {
    inquiries: Inquiry[]
}

export default function InquiriesPage({ inquiries }: InquiriesPageProps) {
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState<null | string>(null);
    const router = useRouter()
    const filteredInquiries = inquiries.filter(i =>
        filter === 'all' ? true : i.status === filter
    )
    const refreshData = () => router.replace(router.asPath);
    const pendingCount = inquiries.filter(i => i.status === 'pending').length

    const updateStatusMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/inquiries/delete?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to update status');
            return response.json();
        },
        onSuccess: (data) => {
            toast.success(`Invoice marked as ${data.status}.`);
            setDeleteAlertOpen(null)
            refreshData();
        },
        onError: () => toast.error('Error updating status.'),
    });


    return (
        <div className="container mx-auto max-w-7xl">

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Inquiries</h1>
                        <p className="text-gray-500">Manage service requests from clients</p>
                    </div>
                    {pendingCount > 0 && (
                        <div className="bg-secondary text-black px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm">
                            {pendingCount} New
                        </div>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                    {[
                        { key: 'all', label: 'All', count: inquiries.length },
                        { key: 'pending', label: 'Pending', count: pendingCount },
                        { key: 'accepted', label: 'Accepted', count: inquiries.filter(i => i.status === 'accepted').length },
                        { key: 'rejected', label: 'Rejected', count: inquiries.filter(i => i.status === 'rejected').length },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as any)}
                            className={`px-4 py-3 text-sm font-semibold transition-colors relative ${filter === tab.key
                                ? 'text-primary'
                                : 'text-gray-400 hover:text-primary'
                                }`}
                        >
                            {tab.label} {tab.count > 0 && (
                                <span className="ml-1.5 text-xs">({tab.count})</span>
                            )}
                            {filter === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {filteredInquiries.length > 0 ? (
                <div className="space-y-3">
                    {filteredInquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="group overflow-visible relative bg-gradient-to-r from-secondary/10  via-white to-secondary/30  rounded-2xl border transition-all cursor-pointer "
                        >

                            <div className="p-3 md:p-6 ">
                                <div className="flex justify-between items-start gap-6">
                                    {/* Left: Client Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Mail size={20} className="text-gray-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-lg text-gray-900 truncate">
                                                    {inquiry.client_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {inquiry.client_email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Services Requested */}
                                        <div className="mb-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Services Requested
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {inquiry.requested_items.map((item, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs font-medium bg-secondary text-gray-700 px-3 py-1.5 rounded-lg  border-gray-200"
                                                    >
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Message Preview */}
                                        {inquiry.message && (
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                {inquiry.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Right: Status & Action */}
                                    <div className="flex flex-col items-end gap-4">
                                        {/* Status Badge */}
                                        <div>
                                            {inquiry.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-500 text-xs font-semibold rounded-full border border-orange-200">
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                                                    Pending
                                                </span>
                                            )}
                                            {inquiry.status === 'accepted' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                                    <CheckCircle2 size={12} />
                                                    Accepted
                                                </span>
                                            )}
                                            {inquiry.status === 'rejected' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                                    <XCircle size={12} />
                                                    Rejected
                                                </span>
                                            )}
                                        </div>

                                        {/* Time */}
                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <Clock size={12} />
                                            {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                                        </p>

                                        {/* Action Button */}
                                        <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white group-hover:scale-110 transition-all duration-200">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between gap-3'>
                                    {
                                        inquiry.end_date && <div className="flex items-center gap-2  w-fit mt-2 text-black">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span>
                                                <span className="font-bold text-primary text-xs uppercase tracking-wider mr-2">
                                                    {inquiry?.start_date && inquiry.start_date !== inquiry.end_date
                                                        ? "Service Period"
                                                        : "Delivery Date"
                                                    }
                                                </span>

                                                {/* Range Logic Display */}
                                                {inquiry.start_date && inquiry.start_date !== inquiry.end_date ? (
                                                    <span className='text-xs'>
                                                        {format(new Date(inquiry.start_date), 'MMM d')}
                                                        {' — '}
                                                        {format(new Date(inquiry.end_date), 'MMM d, yyyy')}
                                                    </span>
                                                ) : (
                                                    <span className='text-xs'>{format(new Date(inquiry.end_date), 'MMMM d, yyyy')}</span>
                                                )}
                                            </span>
                                        </div>
                                    }
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        setDeleteAlertOpen(inquiry?.id)
                                    }} className='cursor-pointer shrink-0'>
                                        <Trash2Icon className='text-destructive' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Inbox size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {filter === 'all' ? 'No inquiries yet' : `No ${filter} inquiries`}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        {filter === 'all'
                            ? 'Share your public profile to start receiving service requests from clients.'
                            : `You don't have any ${filter} inquiries at the moment.`
                        }
                    </p>
                </div>
            )}

            {/* Modal Placeholder */}
            <InquiryReviewModal
                isOpen={!!selectedInquiry}
                onClose={() => setSelectedInquiry(null)}
                inquiry={selectedInquiry}
            />

            <Dialog open={!!isDeleteAlertOpen} onOpenChange={() => setDeleteAlertOpen(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        This will permanently delete inquery. This action cannot be undone.
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAlertOpen(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => updateStatusMutation.mutate(isDeleteAlertOpen ?? "")}
                            disabled={updateStatusMutation.isPending}
                        >
                            {updateStatusMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

// --- SERVER SIDE DATA FETCHING ---
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createPagesServerClient(ctx)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    const { data: inquiries, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('freelancer_id', session.user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching inquiries:", error)
        return { props: { inquiries: [] } }
    }

    return {
        props: {
            inquiries: inquiries || []
        }
    }
}