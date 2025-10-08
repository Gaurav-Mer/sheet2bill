// lib/supabase/storage.ts
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function uploadLogo(supabase: SupabaseClient, userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

    if (error) {
        throw error;
    }

    return filePath;
}