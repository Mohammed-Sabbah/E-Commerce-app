"use client"

import { useCart } from "@/hooks/useCart"
import LoadingSvg from "../LoadingSvg"
import { ProductCardData } from "."

function AddToCartButton({ product, showAddToCart }: { product: ProductCardData, showAddToCart: boolean }) {
    const { addToCart, isAdding } = useCart()
    return (
        <button onClick={() => { addToCart({ productId: product._id, color: "black", quantity: 1 }) }}
            className={`
                        absolute bottom-0 right-0 w-full bg-black text-white text-center px-4 py-2 
                        rounded-none cursor-pointer transition-opacity
                        ${showAddToCart ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `}
        >
            {isAdding ? <LoadingSvg /> : "Add To Cart"}

        </button>
    )
}

export default AddToCartButton