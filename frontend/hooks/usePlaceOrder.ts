import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PaymentMethod } from '@/types/checkout';
import { placeOrder } from '@/services/client/orderService';

interface UsePlaceOrderParams {
    addressId: string;
    paymentMethod: PaymentMethod;
}

export function usePlaceOrder() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async ({ addressId, paymentMethod }: UsePlaceOrderParams) => {
        if (!addressId) {
            setError('Please select a shipping address.');
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await placeOrder({ shippingAddress: addressId, paymentMethod });
            // backend returns: { status, data: { doc: { _id, ... } } }
            const orderId = res?.data?.order?._id;
            router.push(`/order-success?id=${orderId}`);
            return true;
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? 'Something went wrong. Please try again.';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error };
}