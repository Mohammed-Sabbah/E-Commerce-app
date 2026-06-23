export function parseError(err: unknown): string {
    if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        return axiosErr.response?.data?.message ?? "Something went wrong";
    }
    if (err instanceof Error) return err.message;
    return "Something went wrong";
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
