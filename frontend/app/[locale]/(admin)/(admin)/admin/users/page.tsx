import { adminFetch } from "@/lib/adminFetch";
import type { AdminUser } from "@/types/admin";
import AdminUsersClient from "@/components/Admin/AdminUsersClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";

export default async function AdminUsersPage() {
    const { data } = await adminFetch<{ docs: AdminUser[] }>("/api/v1/users?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title="Users" subtitle="View and manage customer accounts" />
            <AdminUsersClient initial={data?.docs ?? []} />
        </div>
    );
}
