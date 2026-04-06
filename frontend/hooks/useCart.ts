"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem
} from "@/services/cartService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useCart = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.CART,
        queryFn: getCart,
    });

    const cart = data?.data?.cart || [];


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
        return cart.some((item: any) => item._id === productId);
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