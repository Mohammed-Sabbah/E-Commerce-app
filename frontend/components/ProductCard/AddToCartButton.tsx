"use client"

import { useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { useCart } from "@/hooks/useCart"
import LoadingSvg from "../LoadingSvg"
import { ProductCardData } from "."

function AddToCartButton({ product, showAddToCart }: { product: ProductCardData, showAddToCart: boolean }) {
    const t = useTranslations('products');
    const hasToken = !!Cookies.get('token');
    const { addToCart, isAdding } = useCart(hasToken)

    return (
        <button onClick={() => { addToCart({ productId: product._id, color: "black", quantity: 1 }) }}
            className={`
                        absolute bottom-0 end-0 w-full bg-black text-white text-center px-4 py-2 
                        rounded-none cursor-pointer transition-opacity
                        ${showAddToCart ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `}
        >
            {isAdding ? <LoadingSvg /> : t('addToCart')}
        </button>
    )
}

export default AddToCartButton