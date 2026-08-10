"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

/**
 * OfflineBanner
 *
 * Listens to the browser's online/offline events and displays:
 * - A red banner when the user loses internet connection
 * - A green confirmation banner (auto-dismisses after 3 seconds) when they reconnect
 *
 * Works seamlessly with TanStack Query's refetchOnReconnect to
 * automatically refresh stale data once back online.
 */
export default function OfflineBanner() {
    // Start as null — avoid hydration mismatch
    const [isOnline, setIsOnline] = useState<boolean | null>(null);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        // Set initial state on client
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnected(true);
            // Auto-dismiss "Back online" message after 3 seconds
            setTimeout(() => setShowReconnected(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowReconnected(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Nothing to show initially (SSR safe) or when fully online & not reconnecting
    if (isOnline === null) return null;
    if (isOnline && !showReconnected) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-white transition-all duration-300 ${
                isOnline
                    ? "bg-green-500"   // Back online
                    : "bg-gray-800"    // Offline
            }`}
        >
            {isOnline ? (
                <>
                    <Wifi className="w-4 h-4 shrink-0" />
                    <span>Back online — your data is being refreshed.</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4 shrink-0" />
                    <span>
                        You&apos;re offline. Showing saved content — some features may be
                        unavailable.
                    </span>
                </>
            )}
        </div>
    );
}
