import { adminFetch } from "@/lib/adminFetch";
import type { AdminCoupon } from "@/types/admin";
import AdminCouponsClient from "@/components/Admin/AdminCouponsClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";
import { getTranslations } from 'next-intl/server';

export default async function AdminCouponsPage() {
    const t = await getTranslations('admin');
    const { data } = await adminFetch<{ docs: AdminCoupon[] }>("/api/v1/coupons?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title={t('coupons')} subtitle={t('couponsSubtitle')} />
            <AdminCouponsClient initial={data?.docs ?? []} />
        </div>
    );
}
