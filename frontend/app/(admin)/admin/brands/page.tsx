import { adminFetch } from "@/lib/adminFetch";
import type { Brand } from "@/types/api";
import AdminBrandsClient from "@/components/Admin/AdminBrandsClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";

export default async function AdminBrandsPage() {
    const { data } = await adminFetch<{ docs: Brand[] }>("/api/v1/brands?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title="Brands" subtitle="Manage product brands" />
            <AdminBrandsClient initial={data?.docs ?? []} />
        </div>
    );
}
