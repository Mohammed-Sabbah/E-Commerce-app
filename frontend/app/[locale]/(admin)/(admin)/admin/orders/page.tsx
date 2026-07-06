import { adminFetch } from "@/lib/adminFetch";
import type { AdminOrder } from "@/types/admin";
import AdminOrdersClient from "@/components/Admin/AdminOrdersClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";
import { getTranslations } from 'next-intl/server';

export default async function AdminOrdersPage() {
    const t = await getTranslations('admin');
    const { data } = await adminFetch<{ docs: AdminOrder[] }>("/api/v1/orders?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title={t('orders')} subtitle={t('ordersSubtitle')} />
            <AdminOrdersClient initial={data?.docs ?? []} />
        </div>
    );
}
