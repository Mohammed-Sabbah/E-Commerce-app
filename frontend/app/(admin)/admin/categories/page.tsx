import { adminFetch } from "@/lib/adminFetch";
import type { Category } from "@/types/api";
import AdminCategoriesClient from "@/components/Admin/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
    const { data } = await adminFetch<{ docs: Category[] }>("/api/v1/categories?limit=1000&sort=-createdAt");
    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Categories</h1>
            <AdminCategoriesClient initial={data?.docs ?? []} />
        </div>
    );
}
