"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";

export default function Providers({
    isAuthenticated,
    children,
}: {
    isAuthenticated: boolean;
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider isAuthenticated={isAuthenticated}>
                {children}
            </AuthProvider>
            <Toaster position="top-right" richColors />
        </QueryClientProvider>
    );
}