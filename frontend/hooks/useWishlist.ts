"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from "@/services/wishlistService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { ProductCardData } from "@/components/ProductCard";

type WishlistItem = ProductCardData;

interface WishlistResponse {
    data?: {
        wishlist?: WishlistItem[];
    };
}

export const useWishlist = (enabled: boolean = true) => {
    const queryClient = useQueryClient();

    const pendingIds = useRef<Set<string>>(new Set());

    const { data, isLoading } = useQuery<WishlistResponse>({
        queryKey: QUERY_KEYS.WISHLIST,
        queryFn: getWishlist,
        // ← لا يبعت أي request إذا المستخدم مش logged in
        // بيوقف 401 error على كل page load لـ guests
        enabled,
    });

    const wishlist: WishlistItem[] = data?.data?.wishlist ?? [];

    const addMutation = useMutation({
        mutationFn: addToWishlist,

        onMutate: async (productId: string) => {
            pendingIds.current.add(productId);
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST });
            const previous = queryClient.getQueryData<WishlistResponse>(QUERY_KEYS.WISHLIST);

            queryClient.setQueryData<WishlistResponse>(QUERY_KEYS.WISHLIST, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        wishlist: [
                            ...(old.data?.wishlist ?? []),
                            { _id: productId, name: "", price: 0, quantity: 0, avgRatings: 0 },
                        ],
                    },
                };
            });
            return { previous, productId };
        },

        onError: (_err, _variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.WISHLIST, context?.previous);
        },

        onSettled: (_data, _err, productId) => {
            pendingIds.current.delete(productId);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWishlist,

        onMutate: async (productId: string) => {
            pendingIds.current.add(productId);
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST });
            const previous = queryClient.getQueryData<WishlistResponse>(QUERY_KEYS.WISHLIST);

            queryClient.setQueryData<WishlistResponse>(QUERY_KEYS.WISHLIST, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        wishlist: (old.data?.wishlist ?? []).filter(
                            (item: WishlistItem) => item._id !== productId
                        ),
                    },
                };
            });

            return { previous, productId };
        },

        onError: (_err, _variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.WISHLIST, context?.previous);
        },

        onSettled: (_data, _err, productId) => {
            pendingIds.current.delete(productId);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
        },
    });

    const isInWishlist = (productId: string) =>
        wishlist.some((item: WishlistItem) => item._id === productId);

    const isPending = (productId: string) =>
        pendingIds.current.has(productId);

    return {
        wishlist,
        isLoading,
        addToWishlist: addMutation.mutate,
        removeFromWishlist: removeMutation.mutate,
        isInWishlist,
        isPending,
    };
};