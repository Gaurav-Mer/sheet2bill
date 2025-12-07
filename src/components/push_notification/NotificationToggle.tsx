'use client'

import { useState } from "react";
import OneSignal from "react-onesignal";
import { Switch } from "@/components/ui/switch";
import { BellRing, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useOnesignalStatus } from "@/hooks/useOnesignalStatus";

export default function NotificationToggle({ savedIds }: { savedIds: string[] }) {
    const { enabled, setEnabled, supported, currentId } = useOnesignalStatus(savedIds);
    const [loading, setLoading] = useState(false);

    if (!supported) return null;

    const waitForId = () =>
        new Promise<string | null>((resolve) => {
            let tries = 0;
            const timer = setInterval(() => {
                tries++;
                const id = OneSignal.User?.PushSubscription?.id;
                const opt = OneSignal.User?.PushSubscription?.optedIn;

                // We wait for BOTH to be true
                if (id && opt) {
                    clearInterval(timer);
                    resolve(id);
                }

                // Timeout after ~9 seconds
                if (tries > 30) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, 300);
        });

    const handleToggle = async (checked: boolean) => {
        setLoading(true);

        if (!checked) {
            // Unsubscribe: Sets SDK state to "User Opted Out"
            OneSignal.User.PushSubscription.optOut();

            if (currentId) {
                // Best effort backend sync
                try {
                    await fetch("/api/push_notification/unsubscribe", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ player_id: currentId }),
                    });
                } catch (e) {
                    console.error("Unsubscribe sync failed", e);
                }
            }
            setEnabled(false);
            toast.success("Notifications disabled");
            setLoading(false);
            return;
        }

        // --- SUBSCRIBE LOGIC ---

        try {
            // 1. CRITICAL FIX: Explicitly Opt-In to reverse the previous Opt-Out
            // Without this, 'optedIn' stays false even if permission is granted.
            OneSignal.User.PushSubscription.optIn();

            // 2. Request/Check Browser Permission
            const permission = await OneSignal.Notifications.requestPermission();

            if (!permission) {
                toast.error("Permission denied");
                // If denied, we should probably opt-out again to keep state consistent
                OneSignal.User.PushSubscription.optOut();
                setEnabled(false);
                setLoading(false);
                return;
            }

            // 3. Wait for SDK to update state (generate ID + flip optedIn to true)
            const id = await waitForId();

            if (!id) {
                console.warn("Timeout waiting for OneSignal ID/OptIn state");
                toast.error("Could not activate notifications");
                // Revert visual state
                setEnabled(false);
                setLoading(false);
                return;
            }

            // 4. Send to Backend
            const res = await fetch("/api/push_notification/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ player_id: id }),
            });

            if (res.ok) {
                setEnabled(true);
                toast.success("Notifications enabled!");
            } else {
                throw new Error("Backend subscription failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
            setEnabled(false);
        } finally {
            setLoading(false);
        }
    };

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
                <Switch checked={enabled} onCheckedChange={handleToggle} disabled={loading} />
            </div>
        </div>
    );
}