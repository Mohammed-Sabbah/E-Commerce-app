import { adminFetch } from "@/lib/adminFetch";
import type { Category } from "@/types/api";
import AdminCategoriesClient from "@/components/Admin/AdminCategoriesClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";

export default async function AdminCategoriesPage() {
    const { data } = await adminFetch<{ docs: Category[] }>("/api/v1/categories?limit=1000&sort=-createdAt");
    return (
        <div>
            <AdminPageHeader title="Categories" subtitle="Organize products by category" />
            <AdminCategoriesClient initial={data?.docs ?? []} />
        </div>
    );
}
