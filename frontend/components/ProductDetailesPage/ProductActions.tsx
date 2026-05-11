'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface Props {
    product: {
        _id: string;
        name: string;
        price: number;
        image: string;
    };
    inStock: boolean;
    selectedColor: string | null;
}

export default function ProductActions({ product, inStock, selectedColor }: Props) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    // ── Wishlist ──────────────────────────────────────────────────────────────
    const { addToWishlist, removeFromWishlist, isInWishlist, isAdding, isRemoving } = useWishlist();
    const exists = isInWishlist(product._id);
    const wishlistLoading = isAdding || isRemoving;

    // ── Cart ──────────────────────────────────────────────────────────────────
    const { addToCart, isAdding: isAddingToCart } = useCart();

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleAddToCart = () => {
        if (!selectedColor) {
            alert('Please select a color first.');
            return;
        }
        addToCart({
            productId: product._id,
            color: selectedColor,
            quantity,
        });
    };

    const handleBuyNow = () => {
        if (!selectedColor) {
            alert('Please select a color first.');
            return;
        }

        // ✅ Search Params — بدون sessionStorage
        const params = new URLSearchParams({
            productId: product._id,
            qty: String(quantity),
            color: selectedColor,
        });

        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Row 1: Quantity + Buy Now */}
            <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded overflow-hidden flex-shrink-0">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <span className="w-10 text-center text-sm font-medium select-none">{quantity}</span>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        disabled={!inStock}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                {/* Buy Now */}
                <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Buy Now
                </button>

                {/* Wishlist */}
                <button
                    onClick={() => exists ? removeFromWishlist(product._id) : addToWishlist(product._id)}
                    disabled={wishlistLoading}
                    className={`w-10 h-10 flex items-center justify-center border rounded transition-all disabled:opacity-50 flex-shrink-0 ${exists
                        ? 'border-red-500 text-red-500'
                        : 'border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-400'
                        }`}
                    aria-label={exists ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    {exists ? <HeartSolid className="w-5 h-5" /> : <HeartOutline className="w-5 h-5" />}
                </button>
            </div>

            {/* Row 2: Add to Cart */}
            <button
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className="w-full h-10 border border-gray-800 hover:bg-gray-800 hover:text-white text-gray-800 text-sm font-medium rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isAddingToCart ? (
                    <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Adding...
                    </>
                ) : (
                    'Add to Cart'
                )}
            </button>
        </div>
    );
}