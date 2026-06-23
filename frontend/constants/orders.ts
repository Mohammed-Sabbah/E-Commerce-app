export const STATUS_STYLES: Record<string, string> = {
    pending:    "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    delivered:  "bg-green-100 text-green-700",
    cancelled:  "bg-red-100 text-red-500",
    returned:   "bg-gray-100 text-gray-500",
};

export function formatId(id: string) {
    return `#${id.slice(-6).toUpperCase()}`;
}
