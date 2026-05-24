import type { Product, ProductsResponse, ProductParams, CategoriesResponse, SubCategoriesResponse } from "@/types/api";

const API = process.env.API_URL;

export async function getProducts(params: ProductParams = {}): Promise<ProductsResponse> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
    });

    try {
        const res = await fetch(`${API}/api/v1/products?${query.toString()}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    } catch {
        return { status: "success", count: 0, data: { docs: [] } };
    }
}

export async function getProductById(id: string): Promise<{ data: { doc: Product } }> {
    try {
        const res = await fetch(`${API}/api/v1/products/${id}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
    } catch {
        return { data: { doc: {} as Product } };
    }
}

export async function getCategories(): Promise<CategoriesResponse> {
    try {
        const res = await fetch(`${API}/api/v1/categories`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
    } catch {
        return { status: "success", count: 0, data: { docs: [] } };
    }
}

export async function getSubCategories(categoryId?: string): Promise<SubCategoriesResponse> {
    const query = categoryId ? `?category=${categoryId}` : "";
    try {
        const res = await fetch(`${API}/api/v1/subcategories${query}`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error("Failed to fetch subcategories");
        return res.json();
    } catch {
        return { status: "success", count: 0, data: { docs: [] } };
    }
}
