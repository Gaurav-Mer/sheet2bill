// components/FeedbackLink.jsx
import { MessageSquare } from 'lucide-react';

export function FeedbackLink() {
    // Replace with your actual support email
    const email = 'support@sheet2bill.com';

    // Pre-fill the subject line for the user
    const subject = encodeURIComponent('Feedback for Sheet2Bill Beta');

    // You can even pre-fill the body to guide the user
    const body = encodeURIComponent(
        `Hi team,\n\nHere's my feedback:\n\n`
    );

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    return (
        <a
            href={mailtoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
            title="Provide Feedback"
        >
            <MessageSquare className="h-6 w-6" />
        </a>
    );
}