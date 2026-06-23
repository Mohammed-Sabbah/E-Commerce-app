'use client';

import { useState } from 'react';
import { applyCoupon } from '@/services/cartService';

interface Props {
    onApply: (discount: number) => void;
    subtotal: number;
}

export default function CouponInput({ onApply, subtotal }: Props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleApply = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await applyCoupon(code.trim());
            const cart = res.data?.cart;
            if (cart?.totalPriceAfterDiscount != null) {
                const discount = subtotal - cart.totalPriceAfterDiscount;
                onApply(discount > 0 ? discount : 0);
                setApplied(true);
            } else {
                onApply(0);
                setError('Coupon could not be applied');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to apply coupon';
            onApply(0);
            setError(msg);
            setApplied(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex gap-3">
                <input
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setError('');
                        setApplied(false);
                        onApply(0);
                    }}
                    placeholder="Coupon Code"
                    className="flex-1 h-11 px-4 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500 transition-colors"
                />
                <button
                    type="button"
                    onClick={handleApply}
                    disabled={loading || !code.trim()}
                    className="h-11 px-6 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                >
                    {loading ? 'Applying...' : 'Apply Coupon'}
                </button>
            </div>
            {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
            {applied && <p className="text-xs text-green-600 pl-1">Coupon applied successfully!</p>}
        </div>
    );
}