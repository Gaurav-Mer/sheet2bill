import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";

export function useOnesignalStatus(savedIds: string[]) {
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await OneSignal.init({
                    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
                    allowLocalhostAsSecureOrigin: true,
                });

                setIsReady(true);

                const id = OneSignal.User?.PushSubscription?.id || null;
                setCurrentId(id);

                if (id && savedIds.includes(id)) {
                    setEnabled(true);
                } else {
                    setEnabled(false);
                }
            } catch (e) {
                console.error("OneSignal Init Error:", e);
            }
        };

        init();
    }, [savedIds]);

    return { enabled, setEnabled, currentId, setCurrentId, isReady };
}
