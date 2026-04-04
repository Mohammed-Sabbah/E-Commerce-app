"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from "@/services/wishlistService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useWishlist = () => {
    const queryClient = useQueryClient();

    // ✅ 1. جلب البيانات
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.WISHLIST,
        queryFn: getWishlist,
    });

    const wishlist = data?.data?.wishlist || [];


    // ✅ 2. إضافة (Optimistic)
    const addMutation = useMutation({
        mutationFn: addToWishlist,

        onMutate: async (productId: string) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST });

            const previous = queryClient.getQueryData(QUERY_KEYS.WISHLIST);

            queryClient.setQueryData(QUERY_KEYS.WISHLIST, (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        wishlist: [...old.data.wishlist, { _id: productId }],
                    },
                };
            });
            return { previous };
        },

        onError: (_err, _variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.WISHLIST, context?.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
        },
    });

    // ✅ 3. حذف (Optimistic)
    const removeMutation = useMutation({
        mutationFn: removeFromWishlist,

        onMutate: async (productId: string) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST });

            const previous = queryClient.getQueryData(QUERY_KEYS.WISHLIST);

            queryClient.setQueryData(QUERY_KEYS.WISHLIST, (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        wishlist: old.data.wishlist.filter(
                            (item: any) => item._id !== productId
                        ),
                    },
                };
            });

            return { previous };
        },

        onError: (_err, _variables, context) => {
            queryClient.setQueryData(QUERY_KEYS.WISHLIST, context?.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
        },
    });


    const isInWishlist = (productId: string) => {
        return wishlist.some((item: any) => item._id === productId);
    };


    return {
        wishlist,
        isLoading,

        addToWishlist: addMutation.mutate,
        removeFromWishlist: removeMutation.mutate,

        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending,

        isInWishlist, // 👈 المهم
    };
};