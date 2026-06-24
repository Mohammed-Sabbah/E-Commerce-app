import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { PaymentMethod } from '@/types/checkout';
import { placeOrder } from '@/services/client/orderService';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface UsePlaceOrderParams {
    addressId: string;
    paymentMethod: PaymentMethod;
    couponCode?: string;
}

export function usePlaceOrder() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async ({ addressId, paymentMethod, couponCode }: UsePlaceOrderParams) => {
        if (!addressId) {
            setError('Please select a shipping address.');
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await placeOrder({ shippingAddress: addressId, paymentMethod, couponCode });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
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