import { adminFetch } from "@/lib/adminFetch";
import type { AdminUser } from "@/types/admin";
import AdminUsersClient from "@/components/Admin/AdminUsersClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";
import { getTranslations } from 'next-intl/server';

export default async function AdminUsersPage() {
    const t = await getTranslations('admin');
    const { data } = await adminFetch<{ docs: AdminUser[] }>("/api/v1/users?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title={t('users')} subtitle={t('usersSubtitle')} />
            <AdminUsersClient initial={data?.docs ?? []} />
        </div>
    );
}
