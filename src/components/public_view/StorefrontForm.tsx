/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Globe, LayoutTemplate, Share2 } from 'lucide-react'
import { StorefrontFormValues, storefrontSchema } from '@/schema/public_view'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { SkillsInput } from '../skill-input/Skill-Input'

export default function StorefrontForm({ initialData }: { initialData: any }) {

    console.log("initialData", initialData)
    const updateProfileMutation = useMutation({
        mutationFn: async (updatedProfile: any) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProfile),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            return response.json();
        },
        onSuccess: () => toast.success('Profile updated successfully!'),
        onError: () => toast.error('Error updating profile.'),
    });


    // Convert DB Array ['React', 'Node'] -> String "React, Node" for the input
    const defaultSkills = initialData?.skills || [] // Expect array now
    const form = useForm<StorefrontFormValues>({
        resolver: zodResolver(storefrontSchema),
        defaultValues: {
            username: initialData?.username || '',
            job_title: initialData?.job_title || '',
            bio: initialData?.bio || '',
            skills: defaultSkills,
            is_public: initialData?.is_public || false,
            is_available: initialData?.is_available || true,
            website: initialData?.website || '',
            linkedin: initialData?.linkedin || '',
            twitter: initialData?.twitter || '',
        }
    })

    const onSubmit = async (data: StorefrontFormValues) => {
        try {
            // 1. Transform comma-separated string back to Array

            // 2. Prepare payload
            const updates = {
                username: data.username?.trim(),
                job_title: data?.job_title?.trim(),
                bio: data?.bio?.trim(),
                skills: data?.skills || [],
                is_public: data.is_public,
                is_available: data.is_available,
                website: data.website?.trim(),
                linkedin: data.linkedin?.trim(),
                twitter: data.twitter?.trim(),
                updated_at: new Date().toISOString(),
            }

            updateProfileMutation.mutate(updates)

        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile.')
        }
    }

    // Helper to get current domain for display
    const origin = 'https://sheet2bill.com'

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"> <Globe size={25} /> Public Visibility</h1>
                    <p className="text-muted-foreground mt-2">Manage how clients find you.</p>
                </div>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
            {/* SECTION 1: VISIBILITY (The "Go Live" Card) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    {/* Live Link Button */}
                    {initialData?.is_public && initialData?.username && (
                        <a
                            href={`/user/${initialData.username}`}
                            target="_blank"
                            className="text-xs  text-primary bg-primary/5 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1  transition"
                        >
                            View Live Page <ExternalLink size={12} />
                        </a>
                    )}
                </div>

                <div className="space-y-4">
                    {/* Publish Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">Publish Storefront</label>
                            <span className="text-xs text-gray-500">Allow clients to see your profile</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <Switch onCheckedChange={(val) => {
                                form.setValue("is_public", val, { shouldDirty: true })
                            }} checked={form.watch("is_public") ?? false}  {...form.register("is_public")} />
                        </label>
                    </div>

                    {/* Availability Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                            <label className="text-sm font-medium text-gray-900 block">Available for Work</label>
                            <span className="text-xs text-gray-500">Shows a green &quot;Available&quot; badge on your photo</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <Switch onCheckedChange={(val) => {
                                form.setValue("is_available", val, { shouldDirty: true })
                            }} checked={form.watch("is_available") ?? false}  {...form.register("is_available")} />
                        </label>
                    </div>
                </div>
            </div>

            {/* SECTION 2: IDENTITY */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <LayoutTemplate size={18} /> Page Details
                </h2>

                {/* Username Input Group */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storefront URL</label>
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset ">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm bg-gray-50 px-3 rounded-l-md border-r border-gray-200">
                            {origin.replace('https://', '')}/
                        </span>
                        <Input
                            type="text"
                            {...form.register('username')}
                            placeholder="jason-design"
                        />
                    </div>
                    {form.formState.errors.username && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.username.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <Input
                            {...form.register('job_title')}
                            placeholder="Senior Frontend Dev"
                            list="job-titles" // Connects to the list below
                        />
                        {/* These options appear when they start typing, but don't force them */}
                        <datalist id="job-titles">
                            <option value="Frontend Developer" />
                            <option value="UI/UX Designer" />
                            <option value="Content Writer" />
                            <option value="SEO Specialist" />
                            <option value="Full Stack Developer" />
                        </datalist>
                    </div>
                    <div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>

                            {/* The Custom Component */}
                            <SkillsInput
                                value={form.watch('skills') || []}
                                onChange={(newSkills) => form.setValue('skills', newSkills, { shouldDirty: true })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <Textarea
                        {...form.register('bio')}
                        rows={3}
                        placeholder="I build high-performance websites for startups."
                    />
                    <div className="flex justify-end mt-1">
                        <span className={`text-xs ${(form?.watch('bio')?.length ?? 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                            {form.watch('bio')?.length || 0}/160
                        </span>
                    </div>
                </div>
            </div>

            {/* SECTION 3: SOCIALS */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Share2 size={18} /> Social Links
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    <Input {...form.register('website')} placeholder="Website URL (https://...)" />
                    <Input {...form.register('linkedin')} placeholder="LinkedIn URL" />
                    <Input {...form.register('twitter')} placeholder="Twitter/X URL" />
                </div>
            </div>
        </form>
    )
}