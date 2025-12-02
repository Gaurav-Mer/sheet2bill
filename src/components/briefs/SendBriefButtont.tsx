'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { openEmailClient } from '@/lib/helper'
import { Brief } from './BriefsList'



export default function SendBriefButton({ brief }: { brief: Brief }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        setLoading(true)

        try {
            // 1. Update Status in Database
            // We mark it as 'sent' so the system knows it's live
            // const { error } = await supabase
            //     .from('briefs')
            //     .update({ status: 'sent' })
            //     .eq('id', brief.id)

            // if (error) throw error

            // // 2. Generate the Magic Link
            // // This uses the current website domain + the secure token
            // const magicLink = `${window.location.origin}/view/${brief.brief_token}`
            const magicLink = `${window.location.origin}/brief/${brief?.brief_token}`

            // 3. Prepare Email Content
            const subject = `Proposal: ${brief.title} (${brief.brief_number})`
            const body = `Hi ${brief.clients?.name},

I have prepared the project brief and proposal for your review.

You can view the scope, timeline, and pricing securely here:
${magicLink}

Please click "Accept" on that page if everything looks good, and we can get started!

Best regards,`

            // 4. Launch Email App
            openEmailClient(brief?.clients?.email ?? "", subject, body)

            // 5. Refresh UI
            router.refresh()

        } catch (error) {
            console.error('Error sending brief:', error)
            alert('Failed to update status.')
        } finally {
            setLoading(false)
        }
    }

    // If already sent/accepted, don't show the send button (or show a different state)
    // if (brief.status !== 'draft') {
    //     return (
    //         <Button variant="outline" disabled className="opacity-50 cursor-not-allowed gap-2">
    //             <CheckCircle2 size={16} />
    //             {brief.status === 'sent' ? 'Sent to Client' : 'Brief Accepted'}
    //         </Button>
    //     )
    // }

    return (
        <button
            onClick={handleSend}
            disabled={loading}
            className='bg-transparent text-black  border-none hover:bg-transparent shadow-none flex items-center gap-3'
        // className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md transition-all"
        >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            Share with client
        </button>
    )
}
