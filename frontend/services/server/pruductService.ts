import type { Product, ProductsResponse, ProductParams, CategoriesResponse } from "@/types/api";

const API = process.env.API_URL;

// ─── Products ─────────────────────────────────────────────────
export async function getProducts(params: ProductParams = {}): Promise<ProductsResponse> {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            query.append(key, String(value));
        }
    });

    const res = await fetch(`${API}/api/v1/products?${query.toString()}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}


export async function getProductById(id: string): Promise<{ data: {doc: Product} }> {
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