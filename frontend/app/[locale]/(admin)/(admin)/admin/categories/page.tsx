import { adminFetch } from "@/lib/adminFetch";
import type { Category } from "@/types/api";
import AdminCategoriesClient from "@/components/Admin/AdminCategoriesClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";
import { getTranslations } from 'next-intl/server';

export default async function AdminCategoriesPage() {
    const t = await getTranslations('admin');
    const { data } = await adminFetch<{ docs: Category[] }>("/api/v1/categories?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title={t('categories')} subtitle={t('categoriesSubtitle')} />
            <AdminCategoriesClient initial={data?.docs ?? []} />
        </div>
    );
}
