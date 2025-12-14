/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { startOfMonth, isAfter } from 'date-fns'
import { PRICING_CONFIG } from '@/lib/pricing'

export function useSubscription(user: any) {
    const supabase = createClientComponentClient()

    // 1. Determine Plan Status
    // We check if the subscription_ends_at date is in the future.
    // If user is null, they are definitely free.
    const isPro = user?.subscription_ends_at && isAfter(new Date(user.subscription_ends_at), new Date())

    // Get the correct config object
    const planKey = isPro ? 'pro' : 'free'
    const planConfig = PRICING_CONFIG.plans[planKey]

    // 2. Fetch Usage (Dynamic Counting)
    // We count how many briefs were created since the 1st of THIS month.
    const { data: usage, isLoading } = useQuery({
        queryKey: ['usage_stats', user?.id, planKey], // Re-fetch if plan changes
        queryFn: async () => {
            if (!user?.id) return { briefs: 0, items: 0, clients: 0 }

            // Logic: Count all briefs created since the 1st of the current month
            const monthStart = startOfMonth(new Date()).toISOString()

            // A. Count Briefs (Monthly Limit)
            const { count: briefCount } = await supabase
                .from('briefs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .gte('created_at', monthStart)

            // B. Count Saved Clients (Total Limit)
            const { count: clientCount } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)

            // C. Count Library Items (Total Limit)
            const { count: itemCount } = await supabase
                .from('line_items') // Assuming you store saved items here or in a separate 'items' table
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
            // If you have a flag for "saved to library", add .eq('is_saved', true) here

            return {
                briefs: briefCount || 0,
                items: itemCount || 0,
                clients: clientCount || 0
            }
        },
        enabled: !!user?.id,
    })

    // 3. Permission Checkers

    // Can they create a new brief?
    const canCreateBrief = () => {
        if (!usage) return true // Optimistic allow while loading
        return usage.briefs < planConfig.limits.briefs_per_month
    }

    // Can they add a new client?
    const canAddClient = () => {
        if (!usage) return true
        return usage.clients < planConfig.limits.clients_saved
    }

    // Can they add a new item to library?
    const canAddItem = () => {
        if (!usage) return true
        return usage.items < planConfig.limits.items_in_library
    }

    // Do they have a specific Pro feature? (e.g. 'premium_templates')
    const hasFeature = (featureKey: keyof typeof planConfig.features) => {
        return planConfig.features[featureKey]
    }

    // 4. Calculate Days Left (For UI display)
    const daysLeft = isPro && user?.subscription_ends_at
        ? Math.ceil((new Date(user.subscription_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0

    return {
        isPro,
        planConfig,
        usage,
        isLoading,
        daysLeft,
        canCreateBrief: canCreateBrief(),
        canAddClient: canAddClient(),
        canAddItem: canAddItem(),
        hasFeature,
    }
}