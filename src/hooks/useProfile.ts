import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Profile } from '@/types';

export function useProfile() {
    const supabase = useSupabaseClient();
    const user = useUser();

    const { data: profile, isLoading, error } = useQuery<Profile | null>({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user) return null;

            // --- THIS IS THE FIX ---
            // .maybeSingle() will return { data: null, error: null } if no row is found,
            // instead of throwing a PGRST116 error.
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle(); // Changed from .single()
            // --- END OF FIX ---

            if (error) {
                // This will now only catch REAL errors (like network issues, etc.)
                throw new Error('Failed to fetch profile: ' + error.message);
            }

            return data;
        },
        // Only run the query if the user is logged in
        enabled: !!user,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes

    });

    return { profile, isLoading, error };
}

