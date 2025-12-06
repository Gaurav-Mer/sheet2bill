'use client'

import { useState } from 'react'
import OneSignal from 'react-onesignal'
import { Switch } from "@/components/ui/switch"
import { BellRing, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useOnesignalStatus } from "@/hooks/useOnesignalStatus"

export default function NotificationToggle({ savedIds }: { savedIds: string[] }) {

    const {
        enabled,
        setEnabled,
        currentId,
        setCurrentId,
        isReady
    } = useOnesignalStatus(savedIds);

    const [loading, setLoading] = useState(false);

    //  Wait until OneSignal generates the ID
    const waitForPlayerId = async (max = 30): Promise<string | null> => {
        return new Promise(resolve => {
            let attempts = 0;

            const timer = setInterval(() => {
                attempts++;

                const id = OneSignal.User?.PushSubscription?.id;
                const optedIn = OneSignal.User?.PushSubscription?.optedIn;

                if (id && optedIn) {
                    clearInterval(timer);
                    resolve(id);
                }

                if (attempts >= max) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, 300);
        });
    };

    const handleToggle = async (checked: boolean) => {
        if (!checked) {
            // ====================
            // DISABLE NOTIFICATIONS
            // ====================
            try {
                setLoading(true);

                OneSignal.User.PushSubscription.optOut();

                if (currentId) {
                    await fetch("/api/push_notification/unsubscribe", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ player_id: currentId })
                    });
                }

                setEnabled(false);
                toast.success("Notifications disabled.");
            } catch (err) {
                console.error(err);
                toast.error("Unable to disable notifications.");
            } finally {
                setLoading(false);
            }
            return;
        }

        // ====================
        // ENABLE NOTIFICATIONS
        // ====================
        try {
            setLoading(true);

            const permission = await OneSignal.Notifications.requestPermission();

            if (!permission) {
                toast.error("Permission denied.");
                setEnabled(false);
                return;
            }

            const newId = await waitForPlayerId();

            if (!newId) {
                toast.error("Could not get device ID.");
                setEnabled(false);
                return;
            }

            setCurrentId(newId);

            const res = await fetch("/api/push_notification/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ player_id: newId })
            });

            if (!res.ok) {
                toast.error("Failed to enable on server.");
                setEnabled(false);
                return;
            }

            setEnabled(true);
            toast.success("Notifications enabled!");

        } catch (err) {
            console.error(err);
            toast.error("Could not enable notifications.");
        } finally {
            setLoading(false);
        }
    };

    if (!isReady) return null;

    return (
        <div className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                    <BellRing size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Real-time Alerts</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                        Get notified instantly when a client accepts your brief or sends a request.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {loading && <Loader2 className="animate-spin text-gray-400" size={16} />}
                <Switch
                    checked={enabled}
                    onCheckedChange={handleToggle}
                    disabled={loading}
                />
            </div>
        </div>
    )
}
