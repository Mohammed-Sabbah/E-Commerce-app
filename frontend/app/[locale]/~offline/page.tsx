"use client";

import { WifiOff, RefreshCw } from "lucide-react";

/**
 * Offline Fallback Page
 * Shown by the Service Worker ONLY when:
 * 1. The user has no internet connection, AND
 * 2. The requested page is NOT in the Service Worker cache
 *
 * Previously visited pages open normally even offline (from cache).
 */
export default function OfflinePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
            {/* Icon */}
            <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
                <WifiOff className="w-10 h-10 text-[#db4444]" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                You&apos;re Offline
            </h1>

            {/* Sub-text */}
            <p className="text-gray-500 max-w-xs mb-8">
                It looks like you&apos;ve lost your internet connection. Please
                check your network and try again.
            </p>

            {/* Retry Button */}
            <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#db4444] hover:bg-[#c03333] text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
            >
                <RefreshCw className="w-4 h-4" />
                Try Again
            </button>

            {/* Brand */}
            <p className="mt-12 text-sm text-gray-400 font-semibold tracking-widest uppercase">
                Exclusive
            </p>
        </div>
    );
}
