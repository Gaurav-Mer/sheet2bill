import { ReactElement } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout'; // Assuming you have a main Layout component

// Define the content in an array for clean and easy updates
const sections = [
    {
        title: "The Dashboard 📊",
        description: "Your mission control center. The dashboard gives you a quick, at-a-glance overview of your freelancing business.",
        steps: [
            "View your most recent briefs and invoices.",
            "See key metrics like your total outstanding balance and what you've earned.",
            "Use the quick-access buttons to create a new client or brief instantly."
        ],
        tip: "Check your dashboard daily for a 30-second update on your business health."
    },
    {
        title: "Managing Clients 👥",
        description: "This is your digital address book. Keeping your client list organized here makes creating new documents a breeze.",
        steps: [
            "Click on 'Clients' in the left-hand navigation.",
            "Select 'Add New Client' and fill in their details.",
            "Once saved, you can select this client from a dropdown when creating a new brief."
        ],
        tip: "Add your client's email address to make sharing briefs and invoices seamless later on."
    },
    {
        title: "Creating a Brief 📝",
        description: "A 'Brief' is the heart of the Sheet2Bill workflow. It's a pre-invoice summary of work that you send to your client for approval first.",
        steps: [
            "Navigate to 'Briefs' and click 'Create New Brief'.",
            "Select your client, add all your work items, and save the brief. A public shareable link is instantly created.",
            "To make it secure, find the brief in your list and click 'Edit'. You can then add a password to protect it.",
            "Send the link to your client so they can review and approve it with a single click."
        ],
        tip: "Getting a brief approved before invoicing is the best way to prevent payment disputes and get paid faster."
    },
    {
        title: "Generating an Invoice 📄",
        description: "This is the final step to getting paid. You can only generate an invoice from a brief that your client has already approved.",
        steps: [
            "Find the approved brief in your list (it will be marked with a green 'Approved' status).",
            "Click the 'Convert to Invoice' button.",
            "That's it! A professional PDF invoice is instantly generated with all the approved details.",
            "You can then download the PDF to send to your client."
        ],
        tip: "Once an invoice is created from an approved brief, its details are locked. This provides a clear and unchangeable record for both you and your client."
    },
    {
        title: "Settings & Customization ✨",
        description: "Make your documents look professional and reflect your brand.",
        steps: [
            "Go to the 'Settings' page from your user menu.",
            "Fill in your company name, address, and contact information.",
            "Upload your company logo."
        ],
        tip: "Complete your settings before you create your first brief. Your logo and details will automatically appear on all your documents."
    }
];

export default function HowItWorksPage() {
    return (
        <main className="bg-background">
            <div className="container mx-auto max-w-4xl py-4 px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">How It Works</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A simple step-by-step guide to mastering your workflow in Sheet2Bill.
                    </p>
                </div>

                <div className="space-y-12">
                    {sections.map((section) => (
                        <section key={section.title} className="p-8 border rounded-lg bg-card">
                            <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
                            <p className="text-muted-foreground mb-6">{section.description}</p>

                            <div className="space-y-3">
                                {section.steps.map((step, stepIndex) => (
                                    <div key={stepIndex} className="flex items-start">
                                        <span className="flex-shrink-0 h-6 w-6 text-primary font-bold text-lg mr-3">
                                            {stepIndex + 1}.
                                        </span>
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>

                            {section.tip && (
                                <div className="mt-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg">
                                    <p><span className="font-semibold">Pro Tip:</span> {section.tip}</p>
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <h3 className="text-2xl font-semibold">Ready to Get Started?</h3>
                    <p className="mt-2 text-muted-foreground">
                        Now that you know the ropes, head back to your dashboard and create your first client or brief.
                    </p>
                    <Link href="/dashboard" className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}

// Apply the main application layout to this page
HowItWorksPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
}; 