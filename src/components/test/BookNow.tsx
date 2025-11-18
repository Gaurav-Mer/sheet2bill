import { useState } from "react";

export default function BookNow() {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const loadAndOpen = () => {
        try {


            // If already loaded → open immediately
            if (scriptLoaded) {
                window.orufyBookings?.Open?.(
                    "https://orufybookings.com/orufy-bookings/orufy-booking-support"
                );
                return;
            }

            // Load CSS
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://orufybookings.com/external/widget.css";
            document.head.appendChild(link);

            // Load JS dynamically
            const script = document.createElement("script");
            script.src = "https://orufybookings.com/external/widget.js";
            script.onload = () => {
                setScriptLoaded(true);
                window.orufyBookings?.Open(
                    "https://orufybookings.com/orufy-bookings/orufy-booking-support"
                );
            };

            document.body.appendChild(script);

        } catch (error) {
            console.log("Error", error)
        }
    };

    return (
        <button
            onClick={loadAndOpen}
            style={{
                padding: "12px 20px",
                background: "#098666",
                color: "#fff",
                borderRadius: "6px",
            }}
        >
            1  Book Now
        </button>
    );
}
