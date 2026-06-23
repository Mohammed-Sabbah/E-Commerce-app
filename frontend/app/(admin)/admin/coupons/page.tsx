import { adminFetch } from "@/lib/adminFetch";
import type { AdminCoupon } from "@/types/admin";
import AdminCouponsClient from "@/components/Admin/AdminCouponsClient";

export default async function AdminCouponsPage() {
    const { data } = await adminFetch<{ docs: AdminCoupon[] }>("/api/v1/coupons?limit=1000&sort=-createdAt");
    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Coupons</h1>
            <AdminCouponsClient initial={data?.docs ?? []} />
        </div>
    );
}
