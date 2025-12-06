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
                    // Note: allowLocalhostAsSecureOrigin is often not needed for localhost on HTTP 
                    // if you use the OneSignal localhost setup, but keeping it if your config relies on it.
                    allowLocalhostAsSecureOrigin: true,
                }).then(() => {
                    console.log("OneSignal Initialized");
                    setIsSupported(true);

                    // Check initial status
                    // We check if they are actually opted in, not just if they have an ID.
                    const isOptedIn = OneSignal.User?.PushSubscription?.optedIn;
                    const id = OneSignal.User?.PushSubscription?.id;

                    setEnabled(!!(isOptedIn && id));
                }).catch((e) => {
                    console.error("OneSignal Init Error:", e);
                });

            } catch (e) {
                console.error("OneSignal Init Failed:", e);
            }
        }
    }, [])

    // --- HELPER: Wait for OneSignal to generate the ID ---
    // We poll every 500ms until we have both an opted-in status and an ID.
    const waitForSubscriptionChange = async (maxAttempts = 20): Promise<string | null> => {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;

                const isOptedIn = OneSignal.User?.PushSubscription?.optedIn;
                const id = OneSignal.User?.PushSubscription?.id;

                // Success: User clicked allowed AND ID was generated
                if (isOptedIn && id) {
                    clearInterval(checkInterval);
                    resolve(id);
                }

                // Timeout: User ignored prompt or network failed
                if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    resolve(null);
                }
            }, 500);
        });
    };

    const handleToggle = async (checked: boolean) => {
        if (!checked) {
            // Opt-out logic
            // Note: We can't revoke browser permission via JS, only opt-out in OneSignal SDK
            OneSignal.User.PushSubscription.optOut();
            setEnabled(false);
            toast.success("Notifications disabled.");
            return;
        }

        setLoading(true);
        try {
            // 1. Check if already subscribed locally
            if (OneSignal.User.PushSubscription.optedIn && OneSignal.User.PushSubscription.id) {
                console.log("User already subscribed locally.");
                setEnabled(true);
                setLoading(false);
                return;
            }

            console.log("Requesting permission...");

            // 2. Trigger the Native Prompt
            // requestPermission waits for the user to click 'Allow' or 'Block'
            const accepted = await OneSignal.Notifications.requestPermission();

            if (!accepted) {
                toast.error("Permission was denied or dismissed.");
                setLoading(false);
                return;
            }

            // 3. Wait for the ID to be generated
            // Even after permission is granted, the ID generation is an async network call.
            const playerId = await waitForSubscriptionChange();

            console.log("Got Player ID:", playerId);

            if (playerId) {
                // 4. Send to Backend
                const res = await fetch('/api/notifications/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ player_id: playerId })
                });

                if (res.ok) {
                    setEnabled(true);
                    toast.success("Notifications enabled successfully!");
                } else {
                    throw new Error("Failed to save subscription to server");
                }
            } else {
                // Permission granted, but ID generation failed/timed out
                toast.error("Connection timeout. Please try again.");
            }
        } catch (e) {
            console.error("Toggle Error:", e);
            toast.error("Could not enable notifications. Check console.");
            // Revert switch state if error
            setEnabled(false);
        } finally {
            setLoading(false);
        }
    }

    if (!isSupported) return null; // Or return a placeholder/loading state

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
                    disabled={loading || enabled}
                // Note: 'enabled' in disabled prop prevents users from trying to toggle OFF 
                // if your logic doesn't support full unsubscribe (browser blocking required).
                // If optOut() works for your case, you can remove '|| enabled'.
                />
            </div>
        </div>
    )
}