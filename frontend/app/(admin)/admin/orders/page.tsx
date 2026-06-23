import { adminFetch } from "@/lib/adminFetch";
import type { AdminOrder } from "@/types/admin";
import AdminOrdersClient from "@/components/Admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
    const { data } = await adminFetch<{ docs: AdminOrder[] }>("/api/v1/orders?limit=1000&sort=-createdAt");
    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Orders</h1>
            <AdminOrdersClient initial={data?.docs ?? []} />
        </div>
    );
}
