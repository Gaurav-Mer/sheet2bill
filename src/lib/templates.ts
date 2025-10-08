// lib/templates.ts

// Define a type for our template settings for better code completion
export type TemplateSettings = {
    theme: {
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        headingColor: string;
    };
    typography: {
        fontFamily: string;
        googleFontUrl?: string;
    };
    layout: {
        headerAlignment: 'left' | 'center' | 'right';
    };
};

export const PREDEFINED_TEMPLATES = [
    {
        id: 'manhattan',
        name: 'Manhattan',
        description: 'A timeless, corporate design with a classic serif font for headings.',
        settings: {
            theme: {
                primaryColor: '#0d47a1', // Deep Navy Blue
                backgroundColor: '#ffffff',
                textColor: '#333333',
                headingColor: '#111827',
            },
            typography: {
                fontFamily: "'Georgia', serif",
            },
            layout: {
                headerAlignment: 'left',
            },
        },
    },
    {
        id: 'zurich',
        name: 'Zurich',
        description: 'A clean, minimalist, and modern design with lots of white space.',
        settings: {
            theme: {
                primaryColor: 'hsl(243, 75%, 59%)', // Our Indigo
                backgroundColor: '#ffffff',
                textColor: '#374151',
                headingColor: 'hsl(243, 75%, 59%)',
            },
            typography: {
                fontFamily: "'Inter', sans-serif",
                googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
            },
            layout: {
                headerAlignment: 'center',
            },
        },
    },
    {
        id: 'kyoto',
        name: 'Kyoto',
        description: 'An elegant and creative design with a warm, dark palette.',
        settings: {
            theme: {
                primaryColor: '#c084fc', // Light Purple
                backgroundColor: '#18181b', // Dark Charcoal
                textColor: '#a1a1aa',
                headingColor: '#ffffff',
            },
            typography: {
                fontFamily: "'Lato', sans-serif",
                googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
            },
            layout: {
                headerAlignment: 'right',
            },
        },
    },
];