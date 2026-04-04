import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // البيانات تعتبر fresh لمدة 5 دقايق
            refetchOnWindowFocus: false, // ما يعمل refetch كل ما ترجع للتاب
            retry: 1, // يعيد المحاولة مرة وحدة بس
        },
        mutations: {
            retry: 0, // ما نعيد mutation
        },
    },
});