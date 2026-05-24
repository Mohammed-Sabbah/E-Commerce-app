import { apiClient } from "@/lib/apiClient";
import { cookies } from "next/headers"; // ← نجيب الـ cookies من الـ server
import { Order } from "@/types/Order";

// helper عشان ما نكرر الكود
async function getServerCookies() {
    const cookieStore = await cookies();
    return { Cookie: cookieStore.toString() };
}

export async function getMyOrders(): Promise<Order[]> {
    try {
        const res = await apiClient.get("/api/v1/orders", {
            headers: await getServerCookies(), // ← نبعت الـ cookies يدوياً
        });
        return res.data?.data?.docs ?? [];
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