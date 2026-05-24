import { apiClient } from "@/lib/apiClient";

export const getCart = async () => {
    const res = await apiClient.get("/api/v1/cart");
    return res.data;
};

export const addToCart = async ({ productId, color, quantity }: { productId: string, color: string, quantity?: number }) => {
    const res = await apiClient.post("/api/v1/cart", {
        productId,
        color,
        quantity
    });
    return res.data;
};

export const removeFromCart = async (productId: string) => {
    const res = await apiClient.delete(`/api/v1/cart/${productId}`);
    return res.data;
};

export const updateCartItem = async ({ productId, quantity }: { productId: string, quantity: number }) => {
    const res = await apiClient.patch(`/api/v1/cart/${productId}`, {
        quantity,
    });
    return res.data;
};