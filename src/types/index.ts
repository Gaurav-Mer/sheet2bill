// types.ts
export type Client = {
    id: number;
    name: string;
    notes?: string
    email?: string
    // ... all other client fields
};

export type LineItem = {
    id?: number;
    description: string;
    quantity: number;
    unit_price: number;
    notes?: string;
    tax_rate?: number;
    currency?: string;
};

export type Brief = {
    id: number;
    client_id: number;
    title: string;
    notes?: string;
    tax_rate?: number;
    currency: string;
    issue_date: string; // ISO date string
    due_date?: string;  // ISO date string
    brief_number: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    subtotal: number;
    tax_amount: number;
    total: number;
    line_items?: LineItem[]; // Optional array of line items
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    // ... any other fields you might have
    user_id: string; // Assuming each brief is associated with a user
    rejection_reason?: string | null;
    brief_token: string; // Unique token for public access
    clients?: { name: string; email?: string | null }; // Joined client data
    is_password_protected?: boolean
    template_id?: string; // NEW: Template identifier
    // ... any other relational data if needed

    // ... all other brief fields
};

// in types.ts
export type Profile = {
    id: string;
    full_name: string | null;
    company_name: string | null;
    avatar_url: string | null;
    website: string | null;
    phone_number: string | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state_province_region: string | null;
    postal_code: string | null;
    country: string | null;
    tax_id: string | null;
    updated_at: string | null;
    email?: string; // Optional email from auth
};


// in types.ts

export type TemplateSettings = {
    theme?: {
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        headingColor: string;
    };
    typography?: {
        fontFamily: string;
        googleFontUrl?: string;
    };
    layout?: {
        headerAlignment: string
    };
};

export type InvoiceTemplateDefinition = {
    id: string | number; // string for pre-defined (e.g., 'zurich'), number for custom
    name: string;
    description: string;
    settings: TemplateSettings;
};