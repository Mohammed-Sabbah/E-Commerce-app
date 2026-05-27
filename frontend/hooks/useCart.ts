"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem
} from "@/services/cartService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { CartItem, CartResponse } from "@/types/cart";

export const useCart = (enabled: boolean = true) => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery<CartResponse>({
        queryKey: QUERY_KEYS.CART,
        queryFn: getCart,
        // ← لا يبعت أي request إذا المستخدم مش logged in
        // بيوقف 401 error على كل page load لـ guests
        enabled,
    });

    const cart = data?.data?.cart;

    // ➕ Add
    const addMutation = useMutation({
        mutationFn: addToCart,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
        },
    });

    // ❌ Remove
    const removeMutation = useMutation({
        mutationFn: removeFromCart,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
        },
    });

    // 🔄 Update quantity
    const updateMutation = useMutation({
        mutationFn: updateCartItem,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
        },
    });

    const isInCart = (productId: string) => {
        return cart?.cartItems?.some((item: CartItem) => item._id === productId) ?? false;
    };

    return {
        cart,
        isLoading,

        addToCart: addMutation.mutate,
        removeFromCart: removeMutation.mutate,
        updateCartItem: updateMutation.mutate,

        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending,
        isUpdating: updateMutation.isPending,

        isInCart,
    };
};