export const PRICING_CONFIG = {
    currency: {
        IN: { symbol: '₹', code: 'INR', rate: 1 },
        US: { symbol: '$', code: 'USD', rate: 0.03 }
    },
    plans: {
        free: {
            id: 'free',
            name: "Starter",
            price: { monthly: 0, yearly: 0 },
            description: "For new freelancers just starting out.",
            limits: {
                briefs_per_month: 3,
                clients_saved: 2,
                items_in_library: 5, // User can only save/dropdown 5 items
                inquiries_per_month: 5, // <--- NEW: Limit free users to 5 leads/month
            },
            features: {
                custom_branding: false, // Watermark stays
                premium_templates: false,
                public_profile: 'basic',
                priority_support: false,
            }
        },
        pro: {
            id: 'pro_monthly', // Used for monthly pass logic
            name: "Pro Freelancer",
            price: { monthly: 299, yearly: 2999 },
            description: "For active freelancers growing their business.",
            limits: {
                briefs_per_month: 200, // Safe cap
                clients_saved: 50,
                items_in_library: 500, // User can save/dropdown 500 items
                inquiries_per_month: 200, // <--- Safe cap for Pro
            },
            features: {
                custom_branding: true, // Watermark removed
                premium_templates: true, // All styles unlocked
                public_profile: 'pro', // Enhanced profile (Socials)
                priority_support: true,
            }
        }
    }
};