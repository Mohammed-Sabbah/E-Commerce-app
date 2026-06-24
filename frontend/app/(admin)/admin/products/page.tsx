import { adminFetch } from "@/lib/adminFetch";
import type { Product, Category, Brand } from "@/types/api";
import AdminProductsClient from "@/components/Admin/AdminProductsClient";
import AdminPageHeader from "@/components/Admin/AdminPageHeader";

export default async function AdminProductsPage() {
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        adminFetch<{ docs: Product[] }>("/api/v1/products?limit=1000&sort=-createdAt"),
        adminFetch<{ docs: Category[] }>("/api/v1/categories?limit=100"),
        adminFetch<{ docs: Brand[] }>("/api/v1/brands?limit=100"),
    ]);

    return (
        <div>
            <AdminPageHeader title="Products" subtitle="Manage your product catalog" />
            <AdminProductsClient
                initialProducts={productsRes.data?.docs ?? []}
                categories={categoriesRes.data?.docs ?? []}
                brands={brandsRes.data?.docs ?? []}
            />
        </div>
    );
}
