'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { openEmailClient } from '@/lib/helper'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Invoice } from '@/pages/invoices'

// Define the structure based on your Invoice type


export default function SendInvoiceButton({ invoice }: { invoice: Invoice }) {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        setLoading(true)

        try {
            // 1. Update Status to 'sent' (if it's still a draft)
            if (invoice.status === 'draft') {
                const { error } = await supabase
                    .from('invoices')
                    .update({ status: 'sent' })
                    .eq('id', invoice.id)

                if (error) throw error
            }

            // 2. Generate the Magic Link
            // Matches your brief pattern: domain/invoice/token
            const magicLink = `${window.location.origin}/invoice/${invoice.invoice_token}`

            // 3. Format the Amount for the email
            const formattedAmount = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency
            }).format(invoice.total)

            // 4. Prepare Email Content (Tailored for Billing)
            const subject = `Invoice ${invoice.invoice_number} `
            const body = `Hi ${invoice.clients?.name},

Please find attached invoice ${invoice.invoice_number} for ${formattedAmount}.

You can view and download the invoice details here:
${magicLink}

Let me know if you have any questions!

Best regards,`

            // 5. Launch Email App
            openEmailClient(invoice.clients?.email ?? "", subject, body)

            // 6. Refresh UI to show "Sent" status
            router.refresh()

        } catch (error) {
            console.error('Error sending invoice:', error)
            alert('Failed to send invoice.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {/* Visual Feedback if already sent */}
            <button
                onClick={handleSend}
                disabled={loading}
                className='flex items-center gap-2 text-sm'
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                Send Invoice
            </button>
        </div>
    )
}