"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>

                {children}
            </QueryClientProvider>
        </Provider>
    );
}