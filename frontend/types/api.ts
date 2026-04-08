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
    category: { name: string };
    subCategory: { name: string }[] | string[];
    brand: { name: string } | string | null;
    avgRatings: number;
    ratingsQuantity: number;
    createdAt: string;
    updatedAt: string;
}
export interface WishlistProduct {
    _id: string;
    name: string;
    price: number;
    priceAfterDiscount?: number;
    coverImage: string;
    category: { name: string } | string;
    subCategory: { name: string }[] | string[];
    brand: { name: string } | string | null;
    avgRatings: number;

}

export interface ProductsResponse {
    status: string;
    count: number;
    data: {
        docs: Product[];
    };
}

export interface ProductParams {
    page?: number;
    limit?: number;
    sort?: string;           // مثال: "-sold" | "-createdAt"
    select?: string;         // مثال: "name,price,image"
    keyword?: string;        // بحث في name و description
    category?: string;
    "priceAfterDiscount[gt]"?: number;   // فلتر المخفضات
    "priceAfterDiscount[gte]"?: number;
    "price[lte]"?: number;
    "price[gte]"?: number;
    [key: string]: string | number | undefined; // لأي فلتر إضافي
}

