import { PRICING_CONFIG } from '@/lib/pricing'
import type { NextApiRequest, NextApiResponse } from 'next'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()
    console.log("razorpay instance:", razorpay, process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
    // 1. Accept 'region' from the frontend
    const { plan, region = 'IN' } = req.body // Default to 'IN'

    const isYearly = plan === 'yearly'

    // 2. Get Base Price (INR)
    const basePrice = isYearly
        ? PRICING_CONFIG.plans.pro.price.yearly
        : PRICING_CONFIG.plans.pro.price.monthly

    // 3. Calculate Final Amount based on Region
    // If Region is US, apply the rate conversion
    let amount = basePrice
    let currencyCode = 'INR'

    if (region === 'US') {
        const rate = PRICING_CONFIG.currency.US.rate
        amount = Math.ceil(basePrice * rate) // e.g. 299 * 0.03 = 9
        currencyCode = 'USD'
    }

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to smallest unit (Paise or Cents)
            currency: currencyCode,
            receipt: `rcpt_${Date.now()}`,
            notes: {
                planType: isYearly ? 'pro_yearly' : 'pro_monthly',
                region: region // Store region for reference
            }
        })

        res.status(200).json(order)
    } catch (err) {
        console.error("Error creating order:", err)
        res.status(500).json({ error: 'Error creating order' })
    }
}