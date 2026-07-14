"use client"

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useCart } from "@/hooks/useCart"
import LoadingSvg from "../LoadingSvg"
import { useAuth } from '@/context/AuthContext';
import { ProductCardData } from "."

function AddToCartButton({ product, showAddToCart }: { product: ProductCardData, showAddToCart: boolean }) {
    const t = useTranslations('products');
    const tToasts = useTranslations('toasts');
    const hasToken = useAuth();
    const { addToCart, isAdding } = useCart(hasToken)
    const inStock = product.quantity > 0;

    function handleClick() {
        if (!hasToken) {
            tToasts && toast.error(tToasts('loginRequired'));
            return;
        }
        if (!inStock) {
            toast.error(t('outOfStock'));
            return;
        }
        addToCart({ productId: product._id, color: "black", quantity: 1 });
    }

    return (
        <button onClick={handleClick}
            disabled={isAdding}
            aria-disabled={!inStock}
            className={`
                        absolute bottom-0 end-0 w-full bg-black text-white text-center px-4 py-2 
                        rounded-none cursor-pointer transition-opacity
                        ${showAddToCart ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                        ${!inStock ? "opacity-50 cursor-not-allowed" : ""}
                    `}
        >
            {isAdding ? <LoadingSvg /> : inStock ? t('addToCart') : t('outOfStock')}
        </button>
    )
}

export default AddToCartButton