import { cookies } from "next/headers";
import { Order } from "@/types/Order";

const API = process.env.API_URL; // ← مباشرة للـ backend مش الـ proxy

export async function getMyOrders(): Promise<Order[]> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return [];

        const res = await fetch(`${API}/api/v1/orders`, {
            headers: { Cookie: `token=${token}` },
            cache: "no-store",
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data?.data?.docs ?? [];
    } catch {
        return [];
    }
}
// // cancelOrder و returnOrder بيشتغلوا من الـ client (browser)
// // فما بحتاجوا تعديل — withCredentials بيكفي
// export async function cancelOrder(id: string): Promise<void> {
//     await apiClient.patch(`/api/v1/orders/${id}/cancel`);
// }

// export async function returnOrder(id: string): Promise<void> {
//     await apiClient.patch(`/api/v1/orders/${id}/return`);
// }