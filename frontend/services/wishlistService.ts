import { apiClient } from "@/lib/apiClient";

export const getWishlist = async () => {
    const res = await apiClient.get("/api/v1/wishlist");
    return res.data;
};

export const addToWishlist = async (productId: string) => {
    const res = await apiClient.post("/api/v1/wishlist", {
        productId,
    });
    return res.data;
};

export const removeFromWishlist = async (productId: string) => {
    const res = await apiClient.delete(`/api/v1/wishlist/${productId}`);
    return res.data;
};