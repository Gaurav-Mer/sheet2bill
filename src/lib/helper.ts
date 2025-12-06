// lib/helper.ts

// --- Email Helper ---
export const openEmailClient = (email: string, subject: string, body: string) => {
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
}

// --- OneSignal Push Notification Helper ---

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY!;

/**
 * Sends a push notification to specific users via OneSignal REST API
 * Updated to use the latest API Gateway endpoints and headers.
 */
export async function sendPushNotification(
    subscriptionIds: string[],
    heading: string,
    content: string,
    url?: string
) {
    console.log("Sending push to IDs:", subscriptionIds);
    if (!subscriptionIds || subscriptionIds.length === 0) return;

    if (!ONESIGNAL_API_KEY) {
        console.error("❌ ONESIGNAL_REST_API_KEY is missing in environment variables.");
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            // Per newer docs (api.onesignal.com), usage of 'Key' prefix is preferred for this endpoint,
            // though 'Basic' is still common on v1. We use 'Key' to match your documentation.
            Authorization: `Key ${ONESIGNAL_API_KEY}`,
        },
        body: JSON.stringify({
            app_id: ONESIGNAL_APP_ID,

            // CRITICAL: Use 'include_subscription_ids' for OneSignal v16+ IDs.
            // 'include_player_ids' is for legacy devices.
            include_subscription_ids: subscriptionIds,

            target_channel: 'push',
            headings: { en: heading },
            contents: { en: content },
            url: url,
        }),
    };

    try {
        // Updated URL to match the new API Gateway format
        const response = await fetch('https://api.onesignal.com/notifications?c=push', options);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ OneSignal API Error:', errorData);
            return;
        }

        const data = await response.json();
        console.log('✅ Push Sent Successfully:', data);
        return data;
    } catch (err) {
        console.error('❌ Network Error sending push:', err);
    }
}