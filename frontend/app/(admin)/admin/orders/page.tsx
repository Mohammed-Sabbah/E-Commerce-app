import { adminFetch } from "@/lib/adminFetch";
import type { AdminOrder } from "@/types/admin";
import AdminOrdersClient from "@/components/Admin/AdminOrdersClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";

export default async function AdminOrdersPage() {
    const { data } = await adminFetch<{ docs: AdminOrder[] }>("/api/v1/orders?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title="Orders" subtitle="Manage customer orders" />
            <AdminOrdersClient initial={data?.docs ?? []} />
        </div>
    );
}
