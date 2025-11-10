export const AVAILABLE_TEMPLATES = [
    { id: "default", name: "Default", description: "The default template", settings: {} },
    {
        id: 'zurich',
        name: 'Zurich',
        description: 'A clean, minimalist, and modern design.',
        settings: {}
    },
    {
        id: 'manhattan',
        name: 'Manhattan',
        description: 'A timeless, classic, and corporate design.',
        settings: {}
    },
    { // NEW TEMPLATE
        id: 'kyoto',
        name: 'Kyoto',
        description: 'An elegant and creative dark-mode design.',
        settings: {
            theme: {
                primaryColor: '#c084fc',
                backgroundColor: '#18181b',
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

    { // NEW TEMPLATE
        id: 'stockholm',
        name: 'Stockholm',
        description: 'A bold and modern split-layout design.',
        settings: {
            theme: {
                primaryColor: '#3B82F6', // Strong Blue
                backgroundColor: '#f9fafb',
                textColor: '#374151',
                headingColor: '#111827',
            },
            typography: {
                fontFamily: "'Inter', sans-serif",
                googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
            },
            layout: {
                headerAlignment: 'left', // This setting is for the *main* content, not the sidebar
            },
        },

    },

    {
        id: 'berlin',
        name: 'Berlin',
        description: 'A bold, creative, and modern asymmetrical design.',
        settings: {
            theme: {
                primaryColor: '#FF4500', // Bold OrangeRed
                backgroundColor: '#ffffff',
                textColor: '#111827',
                headingColor: '#FF4500',
            },
            typography: {
                fontFamily: "'Poppins', sans-serif",
                googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Poppins:wght@700&display=swap',
            },
            layout: {
                headerAlignment: 'left',
            },
        },
    },
    {
        id: 'jaipur',
        name: 'Jaipur',
        description: 'An elegant, warm, and artisan-style design.',
        settings: {
            theme: {
                primaryColor: '#D95B43', // Terracotta/Rust
                backgroundColor: '#FDFBF7', // Cream
                textColor: '#4A3C31', // Dark Brown
                headingColor: '#333333',
            },
            typography: {
                fontFamily: "'Lora', serif",
                googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Lora:wght@700&display=swap',
            },
            layout: {
                headerAlignment: 'center',
            },
        },
    },
    // We can add more templates here in the future
];