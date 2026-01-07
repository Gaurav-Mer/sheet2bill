import { SupabaseClient } from '@supabase/supabase-js'
import { startOfMonth, isAfter, parseISO } from 'date-fns'
import { PRICING_CONFIG } from './pricing'

/**
 * Checks if a user has reached their limit for a specific action.
 * Returns { allowed: boolean, message: string }
 */
export async function checkUserLimit(
    supabase: SupabaseClient,
    userId: string,
    action: 'create_brief' | 'add_client' | 'add_item' | 'receive_inquiry'
) {
    // 1. Fetch User Profile to check Date
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_ends_at, plan_type')
        .eq('id', userId)
        .single()

    // 2. Determine Plan Tier (Date-based logic)
    // If date is null or in the past, they are FREE.
    const isPro = profile?.subscription_ends_at && isAfter(parseISO(profile.subscription_ends_at), new Date())

    // Select the correct rulebook from our Config
    const planKey = isPro ? 'pro' : 'free'
    const limits = PRICING_CONFIG.plans[planKey].limits

    // 3. Check Specific Limits based on Action

    if (action === 'create_brief') {
        const monthStart = startOfMonth(new Date()).toISOString()

        // Count briefs created THIS MONTH (Dynamic Reset)
        const { count } = await supabase
            .from('briefs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', monthStart)

        if ((count || 0) >= limits.briefs_per_month) {
            return {
                allowed: false,
                message: isPro
                    ? `You've reached the safety limit (${limits.briefs_per_month}) for this month.`
                    : `Monthly limit reached (${limits.briefs_per_month}). Upgrade to Pro for 200 briefs/mo.`
            }
        }
    }

    if (action === 'add_client') {
        // Count TOTAL clients (Static Limit)
        const { count } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        console.log("count", count)
        if ((count || 0) >= limits.clients_saved) {
            return {
                allowed: false,
                message: `Client limit reached (${limits.clients_saved}). Upgrade to save more.`
            }
        }
    }

    if (action === 'add_item') {
        // Count TOTAL items (Static Limit)
        const { count } = await supabase
            .from('items') // or 'items' table depending on your schema
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        if ((count || 0) >= limits.items_in_library) {
            return {
                allowed: false,
                message: `Library limit reached (${limits.items_in_library}). Upgrade to add more items.`
            }
        }
    }

    if (action === 'receive_inquiry') {
        const monthStart = startOfMonth(new Date()).toISOString()

        // Count inquiries received THIS MONTH
        // Note: We query 'freelancer_id' because that's who receives it
        const { count } = await supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true })
            .eq('freelancer_id', userId)
            .gte('created_at', monthStart)

        if ((count || 0) >= limits.inquiries_per_month) {
            return {
                allowed: false,
                // Message shown to the PUBLIC client trying to hire the freelancer
                message: `This freelancer is currently unable to accept new inquiries via Sheet2Bill due to plan limits.`
            }
        }
    }

    // If we pass checks
    return { allowed: true, message: 'Allowed' }
}