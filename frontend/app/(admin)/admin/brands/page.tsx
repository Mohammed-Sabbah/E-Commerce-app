import { adminFetch } from "@/lib/adminFetch";
import type { Brand } from "@/types/api";
import AdminBrandsClient from "@/components/Admin/AdminBrandsClient";

export default async function AdminBrandsPage() {
    const { data } = await adminFetch<{ docs: Brand[] }>("/api/v1/brands?limit=1000&sort=-createdAt");
    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Brands</h1>
            <AdminBrandsClient initial={data?.docs ?? []} />
        </div>
    );
}
