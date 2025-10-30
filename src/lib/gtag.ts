/* eslint-disable @typescript-eslint/no-explicit-any */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
    }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
    if (typeof window.gtag === 'function') {
        window.gtag('config', GA_ID, {
            page_path: url,
        })
    }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
type EventParams = {
    action: string
    category: string
    label: string
    value: number
}

export const event = ({ action, category, label, value }: Partial<EventParams>) => {
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        })
    }
}
