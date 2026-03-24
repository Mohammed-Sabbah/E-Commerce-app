import type { Product, ProductsResponse, ProductParams, CategoriesResponse } from "@/types/api";

const API = process.env.API_URL;

// ─── Products ─────────────────────────────────────────────────
export async function getProducts(params: ProductParams = {}): Promise<ProductsResponse> {
    const query = new URLSearchParams(
        Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
    ).toString();

    const res = await fetch(`${API}/api/v1/products${query ? `?${query}` : ""}`, {
        next: { revalidate: 60 }, // cache لمدة 60 ثانية
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export async function getProductById(id: string): Promise<{ data: Product }> {
    const res = await fetch(`${API}/api/v1/products/${id}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
}

// ─── Categories ───────────────────────────────────────────────
export async function getCategories(): Promise<CategoriesResponse> {
    const res = await fetch(`${API}/api/v1/categories`, {
        next: { revalidate: 3600 }, // cache لمدة ساعة (بتتغير نادراً)
    });

    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}