import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Profile } from '@/types';

// This is our central, backend source of truth for plan limits.
const PLAN_LIMITS = {
    free: { clients: 5, briefs: 10 },
    starter: { clients: 50, briefs: 200 },
    pro: { clients: Infinity, briefs: Infinity },
    trialing: { clients: Infinity, briefs: Infinity }, // Trial gives Pro access
};

// This is our main gatekeeper function.
export async function checkPlanLimits(
    supabase: SupabaseClient,
    userId: string,
    action: 'CREATE_CLIENT' | 'CREATE_BRIEF'
) {
    // 1. Get the user's current profile and usage stats in parallel.
    const [profileQuery, clientCountQuery, briefCountQuery] = await Promise.all([
        supabase.from('profiles').select('subscription_status, subscription_ends_at').eq('id', userId).single(),
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('briefs').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    let profile = profileQuery.data as Profile;
    const clientCount = clientCountQuery.count || 0;
    const briefCount = briefCountQuery.count || 0;

    // 2. IMPORTANT: Check if the user's trial has expired.
    if (profile.subscription_status === 'trialing' && new Date(profile.subscription_ends_at!) < new Date()) {
        // Trial is over! Downgrade the user in the database.
        const { data: updatedProfile } = await supabase
            .from('profiles').update({ subscription_status: 'free' }).eq('id', userId).select().single();
        profile = updatedProfile; // Use the new 'free' status for the check.
    }

    const currentPlan = profile.subscription_status as keyof typeof PLAN_LIMITS;

    // 3. Enforce the limits based on the action.
    switch (action) {
        case 'CREATE_CLIENT':
            if (clientCount >= PLAN_LIMITS[currentPlan].clients) {
                throw new Error(`You've reached the ${PLAN_LIMITS[currentPlan].clients}-client limit for the ${currentPlan} plan. Please upgrade to add more.`);
            }
            break;

        case 'CREATE_BRIEF':
            if (briefCount >= PLAN_LIMITS[currentPlan].briefs) {
                throw new Error(`You've reached the limit of briefs for the ${currentPlan} plan. Please upgrade.`);
            }
            break;
    }

    // If no limits are hit, the function completes successfully.
    return;
}