'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Props {
    onApply: (discount: number, code: string) => void;
    subtotal: number;
    initialCode?: string;
}

export default function CouponInput({ onApply, subtotal, initialCode }: Props) {
    const [code, setCode] = useState(initialCode ?? '');
    const [error, setError] = useState('');
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const initialApplied = useRef(false);

    useEffect(() => {
        if (!initialCode || initialApplied.current) return;
        initialApplied.current = true;
        (async () => {
            setLoading(true);
            try {
                const res = await apiClient.post("/api/v1/coupons/validate", { code: initialCode });
                const data = res.data?.data;
                if (data?.valid && data?.discount) {
                    const amount = parseFloat(((subtotal * data.discount) / 100).toFixed(2));
                    onApply(amount, initialCode);
                    setAppliedCode(initialCode);
                }
            } catch {
                // silent — user can retry
            } finally {
                setLoading(false);
            }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleApply = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await apiClient.post("/api/v1/coupons/validate", { code: code.trim() });
            const data = res.data?.data;
            if (data?.valid && data?.discount) {
                const discount = parseFloat(((subtotal * data.discount) / 100).toFixed(2));
                onApply(discount, code.trim());
                setAppliedCode(code.trim());
            } else {
                onApply(0, '');
                setError('Coupon could not be applied');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to validate coupon';
            onApply(0, '');
            setError(msg);
            setAppliedCode(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setCode('');
        setAppliedCode(null);
        setError('');
        onApply(0, '');
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex gap-3">
                <input
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setError('');
                        if (e.target.value !== appliedCode) {
                            setAppliedCode(null);
                            onApply(0, '');
                        }
                    }}
                    placeholder="Coupon Code"
                    className="flex-1 h-11 px-4 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500 transition-colors"
                />
                {appliedCode ? (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="h-11 px-6 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                    >
                        Remove
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleApply}
                        disabled={loading || !code.trim()}
                        className="h-11 px-6 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                    >
                        {loading ? 'Validating...' : 'Apply Coupon'}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500 ps-1">{error}</p>}
            {appliedCode && <p className="text-xs text-green-600 ps-1">Coupon &quot;{appliedCode}&quot; applied — discount shown at checkout</p>}
        </div>
    );
}