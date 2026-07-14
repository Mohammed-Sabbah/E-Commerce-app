import type { Product, ProductsResponse, ProductParams, CategoriesResponse, SubCategoriesResponse } from "@/types/api";
import { getLocale } from "next-intl/server";

const API = process.env.API_URL;

async function addLang(query: URLSearchParams): Promise<URLSearchParams> {
    const locale = await getLocale();
    query.append("lang", locale);
    return query;
}

export async function getProducts(params: ProductParams = {}): Promise<ProductsResponse> {
    const query = await addLang(new URLSearchParams());
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
    });

    try {
        const res = await fetch(`${API}/api/v1/products?${query.toString()}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    } catch (err) {
        console.error("Products fetch error:", err);
        console.error("API was:", API);
        return { status: "success", count: 0, totalCount: 0, data: { docs: [] } };
    }
}

export async function getProductById(id: string): Promise<{ data: { doc: Product } }> {
    try {
        const lang = await getLocale();
        const res = await fetch(`${API}/api/v1/products/${id}?lang=${lang}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
    } catch {
        return { data: { doc: {} as Product } };
    }
}

export async function getCategories(): Promise<CategoriesResponse> {
    try {
        const lang = await getLocale();
        const res = await fetch(`${API}/api/v1/categories?lang=${lang}`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
    } catch {
        return { status: "success", count: 0, data: { docs: [] } };
    }
}

export async function getSubCategories(categoryId?: string): Promise<SubCategoriesResponse> {
    const lang = await getLocale();
    const query = categoryId ? `?category=${categoryId}&lang=${lang}` : `?lang=${lang}`;
    try {
        const res = await fetch(`${API}/api/v1/subcategories${query}`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error("Failed to fetch subcategories");
        return res.json();
    } catch {
        return { status: "success", count: 0, data: { docs: [] } };
    }
}
