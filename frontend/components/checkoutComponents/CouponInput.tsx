'use client';

import { useState } from 'react';

interface Props {
    onApply: (discount: number) => void;
    subtotal: number;
}

export default function CouponInput({ onApply, subtotal }: Props) {
    const [code, setCode]     = useState('');
    const [error, setError]   = useState('');
    const [applied, setApplied] = useState(false);

    const handleApply = () => {
        setError('');
        if (code.trim().toUpperCase() === 'SAVE10') {
            onApply(Math.round(subtotal * 0.1));
            setApplied(true);
        } else {
            onApply(0);
            setApplied(false);
            setError('Invalid coupon code');
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
                    className="h-11 px-6 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                >
                    Apply Coupon
                </button>
            </div>
            {error   && <p className="text-xs text-red-500 pl-1">{error}</p>}
            {applied && <p className="text-xs text-green-600 pl-1">Coupon applied successfully! 🎉</p>}
        </div>
    );
}