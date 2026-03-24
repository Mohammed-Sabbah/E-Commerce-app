// ─── Category ────────────────────────────────────────────────
export interface Category {
    _id: string;
    name: string;
    slug: string;
    photo: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoriesResponse {
    status: string;
    count: number;
    data: {
        docs: Category[];
    };
}

// ─── SubCategory ─────────────────────────────────────────────
export interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    photo: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Brand ───────────────────────────────────────────────────
export interface Brand {
    _id: string;
    name: string;
    slug: string;
    photo: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Product ─────────────────────────────────────────────────
export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    quantity: number;
    sold: number;
    price: number;
    priceAfterDiscount?: number;
    colors: string[];
    coverImage: string;
    images: string[];
    category: { name: string } | string;
    subCategory: { name: string }[] | string[];
    brand: { name: string } | string | null;
    avgRatings: number;
    ratingsQuantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    status: string;
    count: number;
    data: {
        docs: Product[];
    };
}

export interface ProductParams {
    limit?: number;
    page?: number;
    sort?: string;
    category?: string;
    brand?: string;
    search?: string;
    "price[gte]"?: number;
    "price[lte]"?: number;
}
