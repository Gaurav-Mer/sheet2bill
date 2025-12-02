/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from "date-fns"
import {
    Loader2, CheckCircle2, XCircle,
    User, Mail, MessageSquare, Clock
} from 'lucide-react'

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// --- Types matching your DB ---
interface Inquiry {
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
    created_at: string
}

interface InquiryReviewModalProps {
    isOpen: boolean
    onClose: () => void
    inquiry: Inquiry | null
}

export function InquiryReviewModal({ isOpen, onClose, inquiry }: InquiryReviewModalProps) {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [loading, setLoading] = useState(false)

    // --- CONTRACT DATES STATE ---
    // 1. Issue Date: The day the contract starts (Default: Today)
    const [issueDate, setIssueDate] = useState<Date>(new Date())

    // 2. Delivery Date: The day work finishes (Default: Client's requested end date)
    const [deliveryDate, setDeliveryDate] = useState<Date>(new Date())

    // Initialize dates when inquiry loads
    useEffect(() => {
        if (inquiry) {
            // Use the client's deadline as the default delivery date
            setDeliveryDate(inquiry.end_date ? new Date(inquiry.end_date) : new Date())
            // Reset issue date to today
            setIssueDate(new Date())
        }
    }, [inquiry])

    // --- ACTION: ACCEPT (Create Draft Brief) ---
    const handleAccept = async () => {
        if (!inquiry) return
        setLoading(true)

        try {
            // Call the new API endpoint
            const res = await fetch('/api/inquiries/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inquiry_id: inquiry.id,
                    issue_date: issueDate.toISOString(),
                    delivery_date: deliveryDate.toISOString(),
                    // Ensure paymentDueDate is defined in your state
                    // Pass the currency from the inquiry snapshot
                    currency: inquiry.requested_items[0]?.currency || 'USD'
                })
            })

            const data = await res.json()

            if (!res.ok) {
                // Handle Plan Limit Error specifically
                if (res.status === 402) {
                    alert("You have reached your plan limits. Please upgrade to accept more projects.")
                    return
                }
                throw new Error(data.message)
            }

            // Success
            router.push(`/briefs/${data.brief_id}/edit`)
            onClose()

        } catch (error) {
            console.log(error)
            alert("Failed to accept inquiry.")
        } finally {
            setLoading(false)
        }
    }

    // --- ACTION: REJECT (Smart Email) ---
    const handleReject = async () => {
        if (!inquiry) return
        if (!confirm("Are you sure? This will mark the inquiry as rejected.")) return

        setLoading(true)
        try {
            // 1. Update DB status
            await supabase
                .from('inquiries')
                .update({ status: 'rejected' })
                .eq('id', inquiry.id)

            // 2. Construct the Rejection Email (Mailto)
            const subject = `Regarding your project request: ${inquiry.requested_items[0]?.name || 'Service Inquiry'}`
            const body = `Hi ${inquiry.client_name},

Thank you for reaching out and requesting my services.

I have reviewed your project details carefully. Unfortunately, I am unable to take on this project at this time due to my current schedule capacity.

I appreciate you considering me for this work.

Best regards,`

            // 3. Open the User's Email Client
            window.location.href = `mailto:${inquiry.client_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

            router.refresh()
            onClose()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (!inquiry) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh]  gap-0 p-0 rounded-2xl flex flex-col h-full">

                {/* Header */}
                <div className="bg-secondary/50 px-6 py-4 border-b border-gray-100 shrink-0 rounded-t-2xl">
                    <DialogTitle className="text-lg font-bold">Review Inquiry</DialogTitle>
                    <DialogDescription>
                        Review the request details and set initial contract dates.
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-8 overflow-auto flex-1">

                    {/* 1. CLIENT & REQUEST DETAILS (Read Only) */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client Details</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-secondary/20 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                                    <User size={14} className="text-gray-500" /> {inquiry.client_name}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 break-all">
                                    <Mail size={14} className="text-gray-400" /> {inquiry.client_email}
                                </div>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg border border-gray-100 flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                    <Clock size={14} className="text-gray-400" /> Requested Deadline:
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {format(new Date(inquiry.end_date), 'PPP')}
                                </div>
                            </div>
                        </div>

                        {inquiry.message && (
                            <div className="bg-secondary/20 p-4 rounded-lg border">
                                <div className="flex gap-2 items-start">
                                    <MessageSquare size={16} className="text-black mt-0.5 shrink-0" />
                                    <p className="text-sm text-gray-700 italic">&quot;{inquiry.message}&quot;</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. REQUESTED ITEMS (Snapshot) */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requested Scope</h4>
                        <div className="border rounded-xl divide-y divide-gray-100 overflow-hidden">
                            {inquiry.requested_items.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </div>
                                    <span className="font-mono font-medium text-gray-600">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency || 'USD' }).format(item.price)}
                                    </span>
                                </div>
                            ))}
                            {/* Total Row */}
                            <div className="flex justify-between items-center p-3 bg-secondary/20 text-sm font-bold">
                                <span>Total Estimated Value</span>
                                <span>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: inquiry.requested_items[0]?.currency || 'USD'
                                    }).format(
                                        inquiry.requested_items.reduce((acc: number, item: any) => acc + item.price, 0)
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. CONTRACT DATES (Editable) */}
                    <div className="space-y-1  rounded-lg p-2">
                        <p className="text-sm font-semibold text-primary">You can edit these later.</p>
                        <p className="text-xs text-primary font-semibold leading-relaxed">
                            Clicking &ldquo;Create Draft&quot; will open the <strong>Brief Editor</strong>. You can adjust the dates, pricing, and terms there before sending the official link to the client.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-white shrink-0 px-6 py-4 border-t border-gray-100 flex justify-between gap-3">
                    <Button
                        variant="ghost"
                        onClick={handleReject}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <XCircle size={18} className="mr-2" /> Reject & Email
                    </Button>

                    <div className="flex gap-2">
                        <Button onClick={handleAccept} disabled={loading} >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 size={18} className="mr-2" />}
                            Draft Brief
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

