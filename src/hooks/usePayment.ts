/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation' // or 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Define the Razorpay window interface
declare global {
    interface Window {
        Razorpay: any;
    }
}

export function usePayment() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const checkout = async (plan: 'monthly' | 'yearly', region = "IN") => {
        setLoading(true)

        try {
            // 1. Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("Please login to upgrade")
                router.push('/login')
                return
            }

            // 2. Create Order on Backend
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, region })
            })

            const order = await res.json()

            if (!res.ok) throw new Error(order.error || 'Failed to create order')

            // 3. Configure Razorpay Options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "Sheet2Bill Pro",
                description: plan === 'yearly' ? "1 Year Pro Pass" : "30 Days Pro Pass",
                order_id: order.id, // This is the order_id created in the backend

                // 4. Handle Success
                handler: async function (response: any) {
                    toast.loading("Verifying payment...", { id: 'payment-toast' })

                    try {
                        const verifyRes = await fetch('/api/payment/verify-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                userId: user.id,
                                plan: plan
                            })
                        })

                        const verifyData = await verifyRes.json()

                        if (verifyData.success) {
                            toast.success("Upgrade Successful! Welcome to Pro.", { id: 'payment-toast' })
                            router.refresh() // Reloads data to update 'isPro' status
                        } else {
                            toast.error("Payment verification failed. Contact support.", { id: 'payment-toast' })
                        }
                    } catch (err) {
                        console.error(err)
                        toast.error("Error verifying payment", { id: 'payment-toast' })
                    }
                },
                prefill: {
                    email: user.email, // Auto-fill user email
                },
                theme: {
                    color: "#61ac0c", // Your primary color (Blue)
                },
            };

            // 5. Open Popup
            const rzp1 = new window.Razorpay(options);

            rzp1.on('payment.failed', function (response: any) {
                toast.error(`Payment Failed: ${response.error.description}`)
            });

            rzp1.open();

        } catch (error) {
            console.error("Payment Error:", error)
            toast.error("Could not start payment")
        } finally {
            setLoading(false)
        }
    }

    return { checkout, loading }
}