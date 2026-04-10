'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Invoice } from '@/pages/invoices'

export default function SendInvoiceButton({ invoice }: { invoice: Invoice }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!invoice.clients?.email) {
            toast.error('This client has no email address. Add one in the Clients section.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/invoices/${invoice.id}/send`, { method: 'POST' })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message || 'Failed to send invoice.')
                return
            }

            toast.success(`Invoice sent to ${invoice.clients.email}`)
            router.replace(router.asPath)
        } catch {
            toast.error('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleSend}
            disabled={loading}
            className='flex items-center gap-2 text-sm w-full'
        >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            {loading ? 'Sending...' : 'Send Invoice'}
        </button>
    )
}
