interface CartSummaryProps {
    subtotal: number;
    onCheckout: () => void;
}

export default function CartSummary({ subtotal, onCheckout }: CartSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Coupon */}
            <div className="flex gap-3">
                <input
                    placeholder="Coupon Code"
                    className="border px-4 py-2 w-full rounded-md h-14"
                />
                <button className="bg-[#DB4444] text-white px-14 rounded-md h-14 cursor-pointer">
                    Apply
                </button>
            </div>

            {/* Totals */}
            <div className="border rounded-xl p-6 w-full max-w-md md:ml-auto m-auto">
                <h2 className="font-semibold mb-4">Cart Total</h2>

                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>Free</span>
                </div>

                <div className="flex justify-between border-t pt-3 font-bold">
                    <span>Total:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <button
                    onClick={onCheckout}
                    className="mt-5 w-full bg-[#DB4444] text-white py-3 rounded-md cursor-pointer hover:bg-red-600 transition"
                >
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
}