// lib/helper.ts

// --- Email Helper ---
export const openEmailClient = (email: string, subject: string, body: string) => {
    // Check for window to ensure this doesn't crash if accidentally called on server
    if (typeof window !== 'undefined') {
        const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.location.href = mailto
    }
}

// --- OneSignal Push Notification Helper ---

export async function sendPushNotification(
    subscriptionIds: string[],
    heading: string,
    content: string,
    url?: string
) {
    const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    // 1. READ & CLEAN THE KEY
    // We default to "" to prevent crashes if undefined
    const rawKey = process.env.ONESIGNAL_REST_API_KEY || "";

    // 2. SANITIZATION LOGIC
    // Remove whitespace from ends (fixes hidden spaces in .env)
    let finalApiKey = rawKey.trim();

    // Remove "Basic " or "Key " if you accidentally added it to the .env file
    if (finalApiKey.startsWith("Basic ")) finalApiKey = finalApiKey.replace("Basic ", "");
    if (finalApiKey.startsWith("Key ")) finalApiKey = finalApiKey.replace("Key ", "");

    // 3. DEBUG LOGS
    // We wrap the key in quotes "..." in the log so you can see if there are still weird spaces
    console.log(`\n--- 🚀 Sending Push Notification ---`);
    console.log(`📱 App ID: ${ONESIGNAL_APP_ID}`);
    console.log(`🔑 API Key Used: "${finalApiKey.substring(0, 10)}..." (Length: ${finalApiKey.length})`);

    if (!subscriptionIds || subscriptionIds.length === 0) {
        console.warn("⚠️ sendPushNotification aborted: No subscription IDs provided.");
        return;
    }

    if (!finalApiKey) {
        console.error("❌ ONESIGNAL_REST_API_KEY is missing or empty.");
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            // Now we are 100% sure we aren't sending "Key Key ..." or "Key ... "
            Authorization: `Key ${finalApiKey}`,
        },
        body: JSON.stringify({
            app_id: ONESIGNAL_APP_ID,
            include_subscription_ids: subscriptionIds,
            target_channel: 'push',
            headings: { en: heading },
            contents: { en: content },
            url: url,
        }),
    };

    try {
        const response = await fetch('https://api.onesignal.com/notifications?c=push', options);

        // Always try to parse JSON, even on error, to see the message
        const data = await response.json();

        if (!response.ok) {
            console.error('❌ OneSignal API Error:', response.status, JSON.stringify(data, null, 2));
            return;
        }

        console.log('✅ Push Sent Successfully:', data);
        return data;
    } catch (err) {
        console.error('❌ Network Error sending push:', err);
    }
}

export const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.50 },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.88 },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.34 },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.64 },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 10.35 },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rate: 10.58 },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone', rate: 6.87 },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.25 },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 4.92 },
    { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', rate: 17.15 },
];