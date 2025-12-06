export const openEmailClient = (email: string, subject: string, body: string) => {
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
}


const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY!;

/**
 * Sends a push notification to specific users via OneSignal REST API
 */
export async function sendPushNotification(
    playerIds: string[],
    heading: string,
    content: string,
    url?: string
) {
    if (!playerIds || playerIds.length === 0) return;

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
        body: JSON.stringify({
            app_id: ONESIGNAL_APP_ID,
            include_player_ids: playerIds, // Target specific devices
            headings: { en: heading },
            contents: { en: content },
            url: url, // Deep link to open when clicked

            // Optional: Add a nice icon/badge if you have one hosted
            // small_icon: "ic_stat_onesignal_default", 
        }),
    };

    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', options);
        const data = await response.json();
        console.log('Push Sent:', data);
        return data;
    } catch (err) {
        console.error('Error sending push:', err);
    }
}