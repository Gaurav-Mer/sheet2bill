import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import toast from "react-hot-toast";

export default function NotificationButton({ savedIds }: { savedIds: string[] }) {
    const [ready, setReady] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // 🔹 Initialize OneSignal when component loads
    useEffect(() => {
        async function init() {
            try {
                await OneSignal.init({
                    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
                    allowLocalhostAsSecureOrigin: true,
                });

                setReady(true);

                const id = OneSignal.User?.PushSubscription?.id || null;
                setCurrentId(id);
            } catch (err) {
                console.error("OneSignal init error:", err);
            }
        }
        init();
    }, []);

    // 🔹 Simple subscribe function
    async function enableNotifications() {
        try {
            const permission = await OneSignal.Notifications.requestPermission();
            console.log("Permission result:", permission);

            if (!permission) {
                toast.error("Notifications are blocked.");
                return;
            }

            // Ensure opt-in
            await OneSignal.User.PushSubscription.optIn();

            const id = OneSignal.User?.PushSubscription?.id;
            if (!id) {
                toast.error("Could not register device.");
                return;
            }

            // Save to DB
            await fetch("/api/push_notification/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ player_id: id }),
            });

            toast.success("Notifications enabled!");
            setCurrentId(id);
        } catch (err) {
            console.error(err);
            toast.error("Unable to enable notifications.");
        }
    }

    return (
        <div className="mt-4">
            {currentId ? (
                <div className="text-green-600 font-medium">
                    ✓ Notifications are enabled on this device
                </div>
            ) : (
                <button
                    onClick={enableNotifications}
                    disabled={!ready}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Enable Notifications
                </button>
            )}
        </div>
    );
}
