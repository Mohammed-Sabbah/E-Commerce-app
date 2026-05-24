import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function CartEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <ShoppingCartIcon className="w-10 h-10 text-gray-400" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Your cart is empty
            </h2>

            <p className="text-sm text-gray-500 mb-8 max-w-xs">
                Looks like you haven`t added anything yet. Start shopping!
            </p>

            <Link
                href="/products"
                className="inline-block bg-[#DB4444] hover:bg-[#c03a3a] transition-colors text-white text-sm font-medium px-8 py-3 rounded"
            >
                Browse Products
            </Link>
        </div>
    );
}