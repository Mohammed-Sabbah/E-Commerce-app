import { adminFetch } from "@/lib/adminFetch";
import type { Brand } from "@/types/api";
import AdminBrandsClient from "@/components/Admin/AdminBrandsClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";
import { getTranslations } from 'next-intl/server';

export default async function AdminBrandsPage() {
    const t = await getTranslations('admin');
    const { data } = await adminFetch<{ docs: Brand[] }>("/api/v1/brands?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title={t('brands')} subtitle={t('brandsSubtitle')} />
            <AdminBrandsClient initial={data?.docs ?? []} />
        </div>
    );
}
