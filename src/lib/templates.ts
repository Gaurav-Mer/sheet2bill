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
    // We can add more templates here in the future
];