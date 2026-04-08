'use client';

import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface Props {
    productId: string;
    inStock: boolean;
}

export default function ProductActions({ productId, inStock }: Props) {
    const [quantity, setQuantity] = useState(1);

    const {
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isAdding,
        isRemoving,
    } = useWishlist();

    const exists = isInWishlist(productId);
    const wishlistLoading = isAdding || isRemoving;

    return (
        <div className="flex items-center gap-3">
            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                    −
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    +
                </button>
            </div>

            {/* Buy Now */}
            <button
                disabled={!inStock}
                className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Buy Now
            </button>

            {/* Wishlist */}
            <button
                onClick={() => exists ? removeFromWishlist(productId) : addToWishlist(productId)}
                disabled={wishlistLoading}
                className={`w-10 h-10 flex items-center justify-center border rounded transition-all disabled:opacity-50 ${exists
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-400'
                    }`}
            >
                {exists
                    ? <HeartSolid className="w-5 h-5" />
                    : <HeartOutline className="w-5 h-5" />
                }
            </button>
        </div>
    );
}