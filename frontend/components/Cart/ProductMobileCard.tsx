"use client"

import LoadingSvg from "@/components/LoadingSvg";
import { useCart } from "@/hooks/useCart";
import type { CartItem } from "@/types/cart";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ProductMobileCardProps {
    item: CartItem;
    onChange: (id: string, qty: number) => void;
    updates: Record<string, number>;
}

export default function ProductMobileCard({ item, onChange, updates }: ProductMobileCardProps) {

    const { removeFromCart, isRemoving } = useCart();

    const price =
        item.product.priceAfterDiscount ?? item.price;

    const quantity = updates[item._id] ?? item.quantity;

    const handleQtyChange = (value: string) => {
        let newQty = Number(value);
        if (isNaN(newQty) || newQty < 1) newQty = 1;

        onChange(item._id, newQty);
    };


    return (
        <div className="border rounded-xl p-4">
            <div className="relative group w-fit">
                <img
                    src={item.product.coverImage}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-md"
                />

                <button
                    onClick={() => removeFromCart(item._id)}
                    className="absolute top-0 left-0 bg-red-500 text-white p-1 rounded-full cursor-pointer transition"
                >
                    {isRemoving ? <LoadingSvg /> : <XMarkIcon className="w-4 h-4" />}
                </button>
            </div>

            <div className="flex justify-between items-center mt-4">
                <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) =>
                        handleQtyChange(e.target.value)
                    }
                    className="w-20 border rounded-md px-2 py-1 text-center"
                />

                <span className="font-semibold">
                    ${(quantity * price).toFixed(2)}
                </span>
            </div>
        </div>
    );
}


