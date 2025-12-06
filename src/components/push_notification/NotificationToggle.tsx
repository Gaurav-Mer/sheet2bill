'use client'

import { useState, useEffect } from 'react'
import OneSignal from 'react-onesignal'
import { Switch } from "@/components/ui/switch"
import { BellRing, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NotificationToggle() {
    const [enabled, setEnabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // 1. Initialize (Safe to call multiple times)
                OneSignal.init({
                    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
                    // CRITICAL FOR LOCALHOST:
                    allowLocalhostAsSecureOrigin: true,

                }).then(() => {
                    console.log("OneSignal Initialized");
                    setIsSupported(true);
                    // Check initial status
                    // Note: In v16+, use OneSignal.User.PushSubscription.optedIn
                    const isOptedIn = OneSignal.User?.PushSubscription?.optedIn;
                    setEnabled(!!isOptedIn);
                }).catch((e) => {
                    console.error("OneSignal Init Error:", e);
                });

            } catch (e) {
                console.error("OneSignal Init Failed:", e);
            }
        }
    }, [])

    const handleToggle = async (checked: boolean) => {
        if (!checked) {
            toast.error("To disable notifications, you must block them in your browser settings.");
            return;
        }

        setLoading(true);
        try {
            console.log("Requesting permission...");

            // 1. Trigger the Native Prompt
            await OneSignal.Slidedown.promptPush();

            // 2. Wait for the ID to be generated (It might take a second after 'Allow')
            const playerId = await waitForOneSignalId();

            console.log("Got Player ID:", playerId);

            if (playerId) {
                // 3. Send to Backend
                const res = await fetch('/api/notifications/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ player_id: playerId })
                });

                if (res.ok) {
                    setEnabled(true);
                    toast.success("Notifications enabled successfully!");
                } else {
                    throw new Error("Failed to save subscription");
                }
            } else {
                // User likely dismissed or blocked the prompt
                toast.error("Notifications were blocked or dismissed.");
            }
        } catch (e) {
            console.error("Toggle Error:", e);
            toast.error("Could not enable notifications. Check console.");
        } finally {
            setLoading(false);
        }
    }

    // --- HELPER: Wait for OneSignal to generate the ID ---
    // The ID is not always available instantly after permission grant.
    const waitForOneSignalId = async (attempts = 0): Promise<string | null | undefined> => {
        // V16 SDK syntax
        const id = OneSignal.User?.PushSubscription?.id;

        if (id) return id;

        if (attempts > 10) return null; // Give up after 5 seconds

        // Wait 500ms and try again
        await new Promise(r => setTimeout(r, 500));
        return waitForOneSignalId(attempts + 1);
    }

    if (!isSupported) return null;


    return (
        <div className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                    <BellRing size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Real-time Alerts</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                        Get notified instantly when a client accepts your brief or requests a service.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {loading && <Loader2 className="animate-spin text-gray-400" size={16} />}
                <Switch
                    checked={enabled}
                    onCheckedChange={handleToggle}
                    disabled={loading || enabled} // Disable if already on (browser setting required to turn off)
                />
            </div>
        </div>
    )
}