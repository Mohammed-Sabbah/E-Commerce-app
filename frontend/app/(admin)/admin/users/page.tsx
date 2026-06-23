import { adminFetch } from "@/lib/adminFetch";
import type { AdminUser } from "@/types/admin";
import AdminUsersClient from "@/components/Admin/AdminUsersClient";

export default async function AdminUsersPage() {
    const { data } = await adminFetch<{ docs: AdminUser[] }>("/api/v1/users?limit=1000&sort=-createdAt");
    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Users</h1>
            <AdminUsersClient initial={data?.docs ?? []} />
        </div>
    );
}
