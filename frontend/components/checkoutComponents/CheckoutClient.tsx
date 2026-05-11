'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { BillingData, OrderItem, PaymentMethod } from '@/types/checkout';
import BillingForm from './BillingForm';
import OrderSummary from './OrderSummary';
import PaymentMethodSelector from './PaymentMethod';
import CouponInput from './CouponInput';
import type { CartItem } from '@/types/cart';

interface Props {
    initialBilling: BillingData;
    buyNowItem: OrderItem | null; // null = جاي من السلة
}

export default function CheckoutClient({ initialBilling, buyNowItem }: Props) {
    const router = useRouter();

    const [billing, setBilling] = useState<BillingData>(initialBilling);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<OrderItem[]>([]);

    const { cart } = useCart();

    useEffect(() => {
        if (buyNowItem) {
            // ✅ جاي من Buy Now → منتج واحد فقط
            setItems([buyNowItem]);
        } else {
            // ✅ جاي من السلة → كل المنتجات
            if (!Array.isArray(cart?.cartItems)) return;
            const cartItems: OrderItem[] = cart.cartItems.map((item: CartItem) => ({
                _id: item._id,
                name: item.product?.name ?? '',
                price: item.product?.priceAfterDiscount ?? item.price ?? 0,
                quantity: item.quantity,
                image: item.product?.coverImage ?? item.product?.images?.[0] ?? '',
                color: item.color,
            }));
            setItems(cartItems);
        }
    }, [buyNowItem, cart]);

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!billing.firstName || !billing.street || !billing.city || !billing.phone || !billing.email) {
            alert('Please fill in all required fields.');
            return;
        }
        if (paymentMethod === 'bank') return;

        setLoading(true);
        try {
            // TODO: استبدل بـ API call الحقيقي
            // await placeOrder({ billing, items, paymentMethod, discount });
            await new Promise((r) => setTimeout(r, 1000));
            router.push('/order-success');
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

            {/* LEFT — Billing */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Billing Details</h1>
                <BillingForm value={billing} onChange={setBilling} />
            </div>

            {/* RIGHT — Summary + Payment */}
            <div className="flex flex-col gap-6">
                <OrderSummary items={items} discount={discount} />
                <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                <CouponInput onApply={setDiscount} subtotal={subtotal} />

                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={paymentMethod === 'bank' || loading || items.length === 0}
                    className="h-12 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
                               text-white font-medium rounded transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Placing Order...
                        </>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </div>
        </div>
    );
}
