import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";

export function useOnesignalStatus(savedIds: string[]) {
    const [enabled, setEnabled] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                await OneSignal.init({
                    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
                    allowLocalhostAsSecureOrigin: true,
                });

                setSupported(true);

                const permission = OneSignal.Notifications.permission;
                const id = OneSignal.User?.PushSubscription?.id || null;
                const optedIn = OneSignal.User?.PushSubscription?.optedIn;

                setCurrentId(id);

                // CASE 1: Permission removed
                if (permission === false) {
                    setEnabled(false);
                    if (id) await removeIdFromDB(id);
                    return;
                }

                // CASE 2: No valid ID anymore, treat as unsubscribed
                if (!id || id === "null") {
                    setEnabled(false);
                    return;
                }

                // CASE 3: Compare with profile array
                setEnabled(savedIds.includes(id));

            } catch (e) {
                console.error("OneSignal init error:", e);
            }
        }

        init();
    }, [savedIds]);

    return { enabled, setEnabled, supported, currentId };
}

async function removeIdFromDB(id: string) {
    await fetch("/api/push_notification/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: id }),
    });
}
