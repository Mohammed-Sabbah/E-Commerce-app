'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/hooks/useCart';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { PaymentMethod, BillingData } from '@/types/checkout';
import type { Address } from '@/services/server/userService';
import type { CartItem } from '@/types/cart';
import OrderSummary from './OrderSummary';
import PaymentMethodSelector from './PaymentMethod';
import CouponInput from './CouponInput';
import BillingForm from './BillingForm';

interface Props {
    addresses: Address[];
    initialBilling: BillingData;
    initialCoupon?: string;
}

export default function CheckoutClient({ addresses, initialBilling, initialCoupon }: Props) {
    const t = useTranslations('checkout');
    const [selectedAddressId, setSelectedAddressId] = useState<string>(
        addresses[0]?._id ?? ''
    );
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState('');

    const { cart } = useCart();
    const { submit, loading, error } = usePlaceOrder();

    const items = useMemo(() => {
        if (!Array.isArray(cart?.cartItems)) return [];
        return cart.cartItems.map((item: CartItem) => ({
            _id: item._id,
            name: item.product?.name ?? '',
            price: item.product?.priceAfterDiscount ?? item.price ?? 0,
            quantity: item.quantity,
            image: item.product?.coverImage ?? item.product?.images?.[0] ?? '',
            color: item.color,
        }));
    }, [cart]);

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handlePlaceOrder = async () => {
        if (paymentMethod === 'card') return;
        await submit({ addressId: selectedAddressId, paymentMethod, couponCode });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

            {/* LEFT */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">{t('billingDetails')}</h1>

                {addresses.length > 0 ? (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('shippingAddress')}
                        </label>
                        <div className="flex flex-col gap-3">
                            {addresses.map((addr) => (
                                <label
                                    key={addr._id}
                                    className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-colors
                                        ${selectedAddressId === addr._id
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        value={addr._id}
                                        checked={selectedAddressId === addr._id}
                                        onChange={() => setSelectedAddressId(addr._id)}
                                        className="mt-1 accent-red-500"
                                    />
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{addr.alias}</p>
                                        <p className="text-gray-600">{addr.details}, {addr.city}</p>
                                        <p className="text-gray-500">{addr.phone}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-red-500 mb-6">
                        {t.rich('noAddresses', {
                            link: (chunks) => <a href="/account/address" className="underline">{chunks}</a>,
                        })}
                    </p>
                )}

                <BillingForm value={initialBilling} />
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-6">
                <OrderSummary items={items} discount={discount} />
                <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                <CouponInput onApply={(amount, code) => { setDiscount(amount); setCouponCode(code); }} subtotal={subtotal} initialCode={initialCoupon} />

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={
                        paymentMethod === 'card' ||
                        loading ||
                        items.length === 0 ||
                        !selectedAddressId
                    }
                    className="h-12 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
                               text-white font-medium rounded transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t('placingOrder')}
                        </>
                    ) : paymentMethod === 'card' ? (
                        t('cardPaymentComingSoon')
                    ) : (
                        t('placeOrder')
                    )}
                </button>
            </div>
        </div>
    );
}