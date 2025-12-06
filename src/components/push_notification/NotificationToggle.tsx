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
                if (id && opt) {
                    clearInterval(timer);
                    resolve(id);
                }
                if (tries > 30) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, 300);
        });

    const handleToggle = async (checked: boolean) => {
        setLoading(true);

        if (!checked) {
            // Unsubscribe
            OneSignal.User.PushSubscription.optOut();
            if (currentId) {
                await fetch("/api/notifications/unsubscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ player_id: currentId }),
                });
            }
            setEnabled(false);
            toast.success("Notifications disabled");
            setLoading(false);
            return;
        }

        // SUBSCRIBE
        const permission = await OneSignal.Notifications.requestPermission();

        if (!permission) {
            toast.error("Permission denied");
            setEnabled(false);
            setLoading(false);
            return;
        }

        const id = await waitForId();
        if (!id) {
            toast.error("Could not activate notifications");
            setEnabled(false);
            setLoading(false);
            return;
        }

        await fetch("/api/notifications/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id: id }),
        });

        setEnabled(true);
        toast.success("Notifications enabled!");
        setLoading(false);
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
