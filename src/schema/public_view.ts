import { z } from 'zod'

export const storefrontSchema = z.object({
    // Identity
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username is too long")
        .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),

    job_title: z.string().max(60, "Job title is too long").nullish(),
    bio: z.string().max(160, "Keep bio under 160 characters").nullish(),

    // Skills (We handle this as a string in the form, convert to array later)
    skills: z.array(z.string()).optional(), // Change from z.string()
    // Visibility
    is_public: z.boolean().nullish(),
    is_available: z.boolean().nullish(),

    // Socials (Must be valid URLs or empty)
    website: z.union([z.string().url(), z.literal('')]),
    linkedin: z.union([z.string().url(), z.literal('')]),
    twitter: z.union([z.string().url(), z.literal('')]),
})

export type StorefrontFormValues = z.infer<typeof storefrontSchema>