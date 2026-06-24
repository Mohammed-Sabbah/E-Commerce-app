import { adminFetch } from "@/lib/adminFetch";
import type { AdminCoupon } from "@/types/admin";
import AdminCouponsClient from "@/components/Admin/AdminCouponsClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";

export default async function AdminCouponsPage() {
    const { data } = await adminFetch<{ docs: AdminCoupon[] }>("/api/v1/coupons?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title="Coupons" subtitle="Create and manage discount coupons" />
            <AdminCouponsClient initial={data?.docs ?? []} />
        </div>
    );
}
