import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { addDays, addYears, isAfter, parseISO } from 'date-fns'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Initialize Supabase Admin (Service Role) to bypass RLS and update profile securely
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        plan // 'monthly' or 'yearly'
    } = req.body

    // 1. Verify Signature (Security Check)
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
        return res.status(400).json({ success: false, message: "Invalid Signature" })
    }

    try {
        // 2. Fetch Actual Payment Details from Razorpay
        // We do this to get the real Amount and Currency for our ledger
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id)

        // 3. Get User's Current Expiry
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('subscription_ends_at')
            .eq('id', userId)
            .single()

        const currentExpiry = profile?.subscription_ends_at ? parseISO(profile.subscription_ends_at) : new Date()
        const now = new Date()

        // 4. Calculate New Expiry (Stacking Logic)
        const effectiveStartDate = isAfter(currentExpiry, now) ? currentExpiry : now

        let newExpiryDate
        if (plan === 'yearly') {
            newExpiryDate = addYears(effectiveStartDate, 1)
        } else {
            newExpiryDate = addDays(effectiveStartDate, 30)
        }

        // 5. Update Profile (Grant Access)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                subscription_ends_at: newExpiryDate.toISOString(),
                plan_type: plan === 'yearly' ? 'pro_yearly' : 'pro_monthly',
                razorpay_customer_id: paymentDetails.email || ''
            })
            .eq('id', userId)

        if (profileError) throw profileError

        // Count total payments to determine the next number.
        const { count } = await supabaseAdmin
            .from('payments')
            .select('*', { count: 'exact', head: true })

        const nextNum = (count || 0) + 1
        // Format: S2B-2025-00001
        const invoiceNumber = `S2B-${new Date().getFullYear()}-${String(nextNum).padStart(5, '0')}`


        // 6. Insert Payment Record (Ledger)
        // Using GENERIC columns to support future providers (Stripe, etc.)
        const { error: paymentError } = await supabaseAdmin
            .from('payments')
            .insert({
                user_id: userId,

                // Generic Fields
                provider: 'razorpay',
                provider_payment_id: razorpay_payment_id, // Maps to generic column
                provider_order_id: razorpay_order_id,     // Maps to generic column

                amount: paymentDetails.amount, // stored in smallest unit (paise/cents)
                currency: paymentDetails.currency,
                status: paymentDetails.status, // usually 'captured'
                description: plan === 'yearly' ? 'Pro Plan (Yearly)' : 'Pro Plan (Monthly)',
                method: paymentDetails.method, // 'card', 'upi', etc.
                invoice_number: invoiceNumber // <--- Add this field
            })

        if (paymentError) {
            console.error("Failed to record payment in ledger:", paymentError)
            // Note: We don't fail the request here, because the user *did* get the upgrade successfully.
        }

        res.status(200).json({ success: true, newExpiry: newExpiryDate })

    } catch (error) {
        console.error("Processing failed:", error)
        res.status(500).json({ success: false, message: "Server Error during verification" })
    }
}