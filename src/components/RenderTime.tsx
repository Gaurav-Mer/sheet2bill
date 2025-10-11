/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from 'react'

const RenderTime = ({ time }: any) => {
    const [isMounted, setIsMounted] = useState(false);

    // This useEffect hook will only run on the client, after the component has mounted.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If the component has not yet mounted (i.e., we're on the server or in the initial client render),
    // we render a placeholder. This ensures the server and client HTML match.
    if (!isMounted) {
        // You can return null, or a loading "skeleton" for better UX.
        return (
            <div>
                <p className="text-xs text-muted-foreground mt-1">...</p>
            </div>
        );
    }

    // Once mounted, we can safely render the client-side formatted date.
    return (
        <div>
            <p className="text-xs text-muted-foreground mt-1">
                {new Date(time).toLocaleString()}
            </p>
        </div>
    )
}

export default RenderTime;