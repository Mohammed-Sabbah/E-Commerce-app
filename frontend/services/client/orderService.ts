
import { apiClient } from '@/lib/apiClient';

export interface PlaceOrderPayload {
    shippingAddress: string;
    paymentMethod: 'cash' | 'card';
    couponCode?: string;
}

export async function placeOrder(payload: PlaceOrderPayload) {
    const res = await apiClient.post('/api/v1/orders', payload);
    return res.data;
}

export async function getOrderById(id: string) {
    const res = await apiClient.get(`/api/v1/orders/${id}`);
    return res.data;
}

export async function cancelOrder(id: string): Promise<void> {
    await apiClient.patch(`/api/v1/orders/${id}/cancel`);
}

export async function returnOrder(id: string): Promise<void> {
    await apiClient.patch(`/api/v1/orders/${id}/return`);
}