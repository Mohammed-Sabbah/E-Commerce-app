"use client";

import LoadingSvg from "@/components/LoadingSvg";
import { TableCell, TableRow } from "@/components/ui/table";
import { useCart } from "@/hooks/useCart";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ProductRow({ cartItem, onChange, updates }: any) {

    const { removeFromCart, isRemoving } = useCart();


    const price =
        cartItem.product.priceAfterDiscount ?? cartItem.price;

    // 👇 نستخدم القيمة من updates إذا موجودة
    const quantity = updates[cartItem._id] ?? cartItem.quantity;

    const handleQtyChange = (value: string) => {
        let newQty = Number(value);

        if (isNaN(newQty) || newQty < 1) {
            newQty = 1;
        }

        onChange(cartItem._id, newQty);
    };

    return (
        <TableRow className="group">
            <TableCell className="flex items-center gap-3">
                <div className="relative group">
                    <img
                        src={cartItem.product.coverImage}
                        className="w-12 h-12 object-cover rounded-md"
                    />

                    {/* زر الحذف */}
                    <button
                        onClick={() => removeFromCart(cartItem._id)} // اربطه بالـ API تبعك
                        className="absolute cursor-pointer top-0 left-0 bg-red-500 text-white p-1 rounded-full 
                        opacity-0 group-hover:opacity-100 
                        transition duration-200"
                    >
                        {isRemoving ? <LoadingSvg /> : <XMarkIcon className="w-4 h-4" />}
                    </button>
                </div>

                <span className="font-medium">
                    {cartItem.product.name}
                </span>
            </TableCell>

            <TableCell>${price.toFixed(2)}</TableCell>

            <TableCell>
                <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) =>
                        handleQtyChange(e.target.value)
                    }
                    className="w-20 border rounded-md px-2 py-1 text-center"
                />
            </TableCell>

            <TableCell className="font-medium">
                ${(quantity * price).toFixed(2)}
            </TableCell>
        </TableRow>
    );
}

export default ProductRow;