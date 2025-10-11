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
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                // Don't throw an error if the profile just doesn't exist yet
                if (error.code === 'PGRST116') return null;
                throw new Error('Failed to fetch profile');
            }
            return data;
        },
        // Only run the query if the user is logged in
        enabled: !!user,
    });

    return { profile, isLoading, error };
}