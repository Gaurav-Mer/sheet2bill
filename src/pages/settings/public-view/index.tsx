import StorefrontForm from '@/components/public_view/StorefrontForm'
import { Profile } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import React from 'react'

type SettingsPageProps = {
    profile: Profile | null;
};


const PAgeiew = ({ profile }: SettingsPageProps) => {

    return (
        <div className='container mx-auto  max-w-4xl'>
            <StorefrontForm initialData={profile} />
        </div>
    )
}

export default PAgeiew

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    if (!user || authError) return { redirect: { destination: '/login', permanent: false } };

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return { props: { user: user, profile: profile || null } };
};