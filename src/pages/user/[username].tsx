/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import {
    MapPin, Globe, Linkedin, Twitter, Github, Instagram,
    ArrowRight, Briefcase, Star
} from 'lucide-react'
import { ReactElement, useState } from 'react'
import Image from 'next/image'
import { Logo } from '@/components/Logo'
import { Iitem } from '@/types'
import InquiryModal from '@/components/public_view/InquiryModal'

// --- Types ---
interface Profile {
    id: string
    username: string
    company_name: string
    job_title: string | null
    bio: string | null
    avatar_url: string | null
    city: string | null
    country: string | null
    skills: string[] | null
    website: string | null
    linkedin: string | null
    twitter: string | null
    github: string | null
    instagram: string | null
    is_available: boolean
    default_currency?: string
    subscription_ends_at?: string
}

interface PublicProfileProps {
    profile: Profile
    items: Iitem[]
}

// --- Helpers ---
const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        maximumFractionDigits: 0,
    }).format(amount)
}

const SocialIcon = ({ type, url }: { type: string, url?: string | null }) => {
    if (!url) return null

    const iconMap: Record<string, any> = {
        linkedin: <Linkedin size={18} />,
        twitter: <Twitter size={18} />,
        github: <Github size={18} />,
        instagram: <Instagram size={18} />,
        website: <Globe size={18} />
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-secondary backdrop-blur-sm border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-900/20 hover:shadow-lg hover:shadow-gray-900/5 transition-all duration-300 hover:-translate-y-0.5"
        >
            {iconMap[type] || <Globe size={18} />}
        </a>
    )
}

// --- Main Component ---
export default function PublicProfile({ profile, items }: PublicProfileProps) {
    console.log("profile", profile?.subscription_ends_at)
    const [selectedItem, setSelectedItem] = useState<Iitem | null>(null);
    const isPro = profile?.subscription_ends_at
        ? new Date(profile.subscription_ends_at) > new Date()
        : false;

    return (
        <div className="min-h-dvh bg-white">
            <Head>
                <title>{profile.company_name} | Services</title>
                <meta name="description" content={profile.bio || `Hire ${profile.company_name}`} />
            </Head>

            <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-20">

                {/* --- HEADER CARD --- */}
                <div className="relative group mb-6 sm:mb-8">
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl sm:rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-gray-900/5 border border-gray-200/50 overflow-hidden">
                        {/* Gradient Header */}
                        <div className="h-32 sm:h-52 bg-secondary relative overflow-hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute inset-0 w-full h-full opacity-30 object-cover"
                                viewBox="0 0 256 256"
                                preserveAspectRatio="xMidYMid slice"
                                fill="none"
                            >
                                <path
                                    d="M 32 192 C 32 209.673 46.327 224 64 224 C 64 241.673 49.673 256 32 256 C 14.327 256 0 241.673 0 224 C 0 206.327 14.327 192 32 192 Z M 96 192 C 96 209.673 110.327 224 128 224 C 128 241.673 113.673 256 96 256 C 78.327 256 64 241.673 64 224 C 81.673 224 96 209.673 96 192 Z M 160 192 C 160 209.673 174.327 224 192 224 C 192 241.673 177.673 256 160 256 C 142.327 256 128 241.673 128 224 C 145.673 224 160 209.673 160 192 Z M 224 192 C 241.673 192 256 206.327 256 224 C 256 241.673 241.673 256 224 256 C 206.327 256 192 241.673 192 224 C 209.673 224 224 209.673 224 192 Z M 32 128 C 32 145.673 46.327 160 64 160 C 46.327 160 32 174.327 32 192 C 14.327 192 0 177.673 0 160 C 0 142.327 14.327 128 32 128 Z M 96 128 C 96 145.673 110.327 160 128 160 C 128 177.673 113.673 192 96 192 C 78.327 192 64 177.673 64 160 C 64 142.327 78.327 128 96 128 Z M 160 128 C 177.673 128 192 142.327 192 160 C 192 177.673 177.673 192 160 192 C 142.327 192 128 177.673 128 160 C 145.673 160 160 145.673 160 128 Z M 224 128 C 241.673 128 256 142.327 256 160 C 256 177.673 241.673 192 224 192 C 224 174.327 209.673 160 192 160 C 209.673 160 224 145.673 224 128 Z M 32 64 C 32 81.673 46.327 96 64 96 C 46.327 96 32 110.327 32 128 C 14.327 128 0 113.673 0 96 C 0 78.327 14.327 64 32 64 Z M 96 64 C 113.673 64 128 78.327 128 96 C 110.327 96 96 110.327 96 128 C 78.327 128 64 113.673 64 96 C 64 78.327 78.327 64 96 64 Z M 160 64 C 177.673 64 192 78.327 192 96 C 192 113.673 177.673 128 160 128 C 160 110.327 145.673 96 128 96 C 128 78.327 142.327 64 160 64 Z M 224 64 C 241.673 64 256 78.327 256 96 C 256 113.673 241.673 128 224 128 C 224 110.327 209.673 96 192 96 C 192 78.327 209.673 64 224 64 Z M 32 0 C 49.673 0 64 14.327 64 32 C 46.327 32 32 46.327 32 64 C 14.327 64 0 49.673 0 32 C 0 14.327 14.327 0 32 0 Z M 96 0 C 113.673 0 128 14.327 128 32 C 110.327 32 96 46.327 96 64 C 96 46.327 81.673 32 64 32 C 64 14.327 78.327 0 96 0 Z M 160 0 C 177.673 0 192 14.327 192 32 C 174.327 32 160 46.327 160 64 C 160 46.327 145.673 32 128 32 C 128 14.327 142.327 0 160 0 Z M 224 0 C 241.673 0 256 14.327 256 32 C 256 49.673 241.673 64 224 64 C 224 46.327 209.673 32 192 32 C 192 14.327 206.327 0 224 0 Z"
                                    fill="white"
                                />
                            </svg>
                        </div>

                        <div className="px-4 sm:px-8 md:px-12 pb-6 sm:pb-12 -mt-12 sm:-mt-20 relative">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                                {/* Avatar Section */}
                                <div className="flex-shrink-0 w-full sm:w-auto">
                                    <div className="relative inline-block">
                                        {/* Avatar glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-purple-500 rounded-2xl sm:rounded-3xl blur-2xl opacity-20" />

                                        {profile.avatar_url ? (
                                            <Image
                                                width={144}
                                                height={144}
                                                src={profile.avatar_url}
                                                alt={profile.company_name}
                                                className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-2xl shadow-gray-900/10 bg-white"
                                            />
                                        ) : (
                                            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl border-4 border-white shadow-2xl shadow-gray-900/10 bg-secondary flex items-center justify-center">
                                                <span className="text-black italic text-4xl sm:text-6xl font-bold tracking-tight">
                                                    {profile.company_name?.charAt(0)?.toUpperCase() || "?"}
                                                </span>
                                            </div>
                                        )}

                                        {profile.is_available && (
                                            <div className="absolute -bottom-1 -right-2 sm:-bottom-2 sm:-right-4 bg-gradient-to-br from-green-500 to-green-600 text-white text-[8px] font-semibold tracking-wide px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm shadow-lg shadow-emerald-600/20 flex items-center gap-1 sm:gap-1.5 border border-white/20">
                                                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white"></span>
                                                </span>
                                                <span className="uppercase text-[8px] font-bold tracking-wider drop-shadow">
                                                    Available
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {(profile.city || profile.country) && (
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-3 sm:mt-6 justify-start bg-gray-50/50 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200/50 w-fit">
                                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                            <span className="font-medium truncate">{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Section */}
                                <div className="flex-1 min-w-0 pt-2 sm:pt-4 w-full">
                                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-6 tracking-tight break-words">
                                        {profile.company_name}
                                    </h1>

                                    {/* Job Title */}
                                    {profile.job_title && (
                                        <div className="mb-3 sm:mb-4 mt-2 inline-flex items-center gap-2 text-black text-lg sm:text-2xl font-semibold">
                                            {profile.job_title}
                                        </div>
                                    )}

                                    {/* Social Icons */}
                                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-8">
                                        <SocialIcon type="website" url={profile.website} />
                                        <SocialIcon type="linkedin" url={profile.linkedin} />
                                        <SocialIcon type="twitter" url={profile.twitter} />
                                        <SocialIcon type="github" url={profile.github} />
                                        <SocialIcon type="instagram" url={profile.instagram} />
                                    </div>

                                    {/* Skills */}
                                    {profile.skills && profile.skills.length > 0 && (
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Expertise</div>
                                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                                {profile.skills.map((skill, idx) => (
                                                    <span
                                                        key={skill}
                                                        className="group px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-gray-700 border border-gray-200/50 flex items-center gap-1.5 sm:gap-2 hover:border-gray-900/20 hover:shadow-lg hover:shadow-gray-900/5 transition-all duration-300 hover:-translate-y-0.5"
                                                        style={{
                                                            animationDelay: `${idx * 50}ms`
                                                        }}
                                                    >
                                                        <Star size={12} className="text-amber-500 group-hover:text-amber-600 transition-colors flex-shrink-0" fill="currentColor" />
                                                        <span className="truncate">{skill}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BIO SECTION --- */}
                {profile.bio && (
                    <div className="group relative mb-6 sm:mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-secondary/20 to-secondary/10 rounded-2xl sm:rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] shadow-xl shadow-gray-900/5 border border-gray-200/50 px-4 sm:px-8 md:px-12 py-6 sm:py-10">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-gray-900 to-gray-600 rounded-full" />
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">About</h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-lg leading-relaxed font-light break-words">
                                {profile.bio}
                            </p>
                        </div>
                    </div>
                )}

                {/* --- SERVICES SECTION --- */}
                <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-secondary/20 to-secondary/10 rounded-2xl sm:rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] shadow-xl shadow-gray-900/5 border border-gray-200/50 overflow-hidden">
                        <div className="px-4 sm:px-8 md:px-12 py-4 sm:py-8 border-b border-gray-100/50">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-gray-900 to-gray-600 rounded-full" />
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
                            </div>
                        </div>

                        <div className="px-4 sm:px-8 md:px-12 py-6 sm:py-10">
                            {items?.length > 0 ? (
                                <div className="space-y-4 sm:space-y-5">
                                    {items?.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedItem(item)}
                                            style={{
                                                animationDelay: `${idx * 100}ms`
                                            }}
                                            className="relative bg-gradient-to-br cursor-pointer from-white to-secondary/10 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-300 hover:-translate-y-1 group/item"
                                        >
                                            {/* Subtle gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-secondary/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />

                                            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                                                <div className="flex-1 w-full sm:pr-6">
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary to-secondary flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-lg shadow-gray-900/10 flex-shrink-0">
                                                            <Briefcase size={18} className="text-black sm:w-[22px] sm:h-[22px]" />
                                                        </div>
                                                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 group-hover/item:text-gray-900 transition-colors break-words flex-1">
                                                            {item.name}
                                                        </h3>
                                                    </div>
                                                    {item.description && (
                                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed sm:ml-[4.5rem] font-light break-words">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                    <div className="text-left sm:text-right">
                                                        <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Starting at</div>
                                                        <div className="text-xl sm:text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                            {formatPrice(item.default_price, profile?.default_currency ?? "USD")}
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary to-secondary flex items-center justify-center text-secondary group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 shadow-lg shadow-gray-900/20 flex-shrink-0">
                                                        <ArrowRight className='text-black' size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 sm:py-20">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-gray-200/50">
                                        <Briefcase size={28} className="text-gray-400 sm:w-8 sm:h-8" />
                                    </div>
                                    <p className="text-gray-900 font-bold text-lg sm:text-xl mb-2">No services available yet</p>
                                    <p className="text-xs sm:text-sm text-gray-500">Check back soon for updates</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <InquiryModal currency={profile?.default_currency} allItems={items} initialItem={selectedItem} freelancerId={profile?.id} isOpen={!!selectedItem?.id} onClose={() => setSelectedItem(null)} />
                </div>

                {/* --- FOOTER --- */}
                {isPro ? null : <footer className="mt-8 sm:mt-12 text-center px-4">
                    <Link
                        href="https://sheet2bill.com?utm_source=public_profile&utm_medium=footer_link&utm_campaign=public_profile_footer"
                        className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors group"
                    >
                        <div className='flex items-center gap-2 flex-col'>
                            <div className='flex items-center gap-2 text-[10px]'>
                                Powered by
                            </div>
                            <div className='flex items-center gap-2'>
                                <Logo /> <span className='font-semibold'>Sheet2Bill</span>
                            </div>
                        </div>
                    </Link>
                </footer>}

            </main>
        </div>
    )
}

PublicProfile.getLayout = function getLayout(page: ReactElement) { return page; };

// --- Server Side Data Fetching ---
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createPagesServerClient(ctx)
    const { username } = ctx.params as { username: string }

    // 1. Get Profile
    const { data: profile, error: profileError } = await supabase
        .from('public_profiles_view')
        .select('*')
        .eq('username', username)
        .maybeSingle()

    if (!profile || profileError) {
        return { notFound: true }
    }

    // 2. Get Items
    const { data: items } = await supabase
        .from('public_items_view')
        .select('id, name, description, default_price')
        .eq('user_id', profile.id)
        .order('default_price', { ascending: true })

    return {
        props: {
            profile,
            items: items || []
        }
    }
}