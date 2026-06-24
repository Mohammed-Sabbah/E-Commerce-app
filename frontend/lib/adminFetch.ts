import { cookies } from "next/headers";

const BASE = process.env.API_URL;

export async function adminFetch<T>(
    path: string,
    options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
    try {
        if (!BASE) return { data: null, error: "API_URL is not configured" };
        const token = (await cookies()).get("token")?.value;
        const res = await fetch(`${BASE}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Cookie: `token=${token}` } : {}),
                ...options?.headers,
            },
            cache: "no-store",
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            return { data: null, error: body?.message ?? `Request failed (${res.status})` };
        }
        const json = await res.json();
        return { data: json?.data ?? json, error: null };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { data: null, error: msg };
    }
}
