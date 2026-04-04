'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import LoadingSvg from '../LoadingSvg';
import { useEffect, useState } from 'react';

function HeartIconButton({ productId }: { productId: string }) {

    const {
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isAdding,
        isRemoving,
        isLoading,
    } = useWishlist();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="bg-white/80 w-9 h-9 rounded-full absolute top-2.5 right-2.5 flex items-center justify-center">
                <HeartOutline className="h-6 w-6 text-gray-700 translate-y-[1px]" />
            </button>
        );
    }

    const exists = isInWishlist(productId);
    const loading = isAdding || isRemoving || isLoading;

    return (
        <button
            className="bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-2.5 right-2.5 cursor-pointer flex items-center justify-center transition-all"
            disabled={loading}
            onClick={() => {
                if (exists) {
                    removeFromWishlist(productId);
                } else {
                    addToWishlist(productId);
                }
            }}
        >
            {loading ? (
                <LoadingSvg />
            ) : exists ? (
                <HeartSolid className="h-6 w-6 text-red-500 translate-y-[1px]" />
            ) : (
                <HeartOutline className="h-6 w-6 text-gray-700 translate-y-[1px]" />
            )}
        </button>
    );
}

export default HeartIconButton;