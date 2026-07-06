"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { apiClient } from "@/lib/apiClient";

interface CartSummaryProps {
    subtotal: number;
    onCheckout: (couponCode?: string) => void;
}

export default function CartSummary({ subtotal, onCheckout }: CartSummaryProps) {
    const t = useTranslations('cart');
    const [code, setCode] = useState("");
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const total = subtotal - discount;

    const handleApply = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await apiClient.post("/api/v1/coupons/validate", { code: code.trim() });
            const data = res.data?.data;
            if (data?.valid && data?.discount) {
                const amount = parseFloat(((subtotal * data.discount) / 100).toFixed(2));
                setDiscount(amount);
                setAppliedCode(code.trim());
            } else {
                setError("Coupon could not be applied");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid or expired coupon");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setCode("");
        setAppliedCode(null);
        setDiscount(0);
        setError("");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Coupon */}
            <div>
                <div className="flex gap-3">
                    <input
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError("");
                            if (e.target.value !== appliedCode) {
                                setAppliedCode(null);
                                setDiscount(0);
                            }
                        }}
                        placeholder={t('couponCode')}
                        className="border px-4 py-2 w-full rounded-md h-14"
                    />
                    {appliedCode ? (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-gray-500 text-white px-14 rounded-md h-14 cursor-pointer"
                        >
                            {t('removeCoupon')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={loading || !code.trim()}
                            className="bg-[#DB4444] text-white px-14 rounded-md h-14 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "..." : t('applyCoupon')}
                        </button>
                    )}
                </div>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>

            {/* Totals */}
            <div className="border rounded-xl p-6 w-full max-w-md md:ml-auto m-auto">
                <h2 className="font-semibold mb-4">Cart Total</h2>

                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between mb-2">
                        <span className="text-green-600">Discount:</span>
                        <span className="text-green-600">-${discount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>Free</span>
                </div>

                <div className="flex justify-between border-t pt-3 font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <button
                    onClick={() => onCheckout(appliedCode ?? undefined)}
                    className="mt-5 w-full bg-[#DB4444] text-white py-3 rounded-md cursor-pointer hover:bg-red-600 transition"
                >
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
}