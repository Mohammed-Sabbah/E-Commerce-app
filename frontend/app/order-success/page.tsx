'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/services/client/orderService';
import Container from '@/components/Container';

interface OrderItem {
    _id: string;
    product: {
        name: string;
        coverImage?: string;
        images?: string[];
    };
    quantity: number;
    price: number;
    color?: string;
}

interface Order {
    _id: string;
    cartItems: OrderItem[];
    shippingAddress: string; // ID only — not populated
    paymentMethod: string;
    taxValue: number;
    shippingValue: number;
    totalOrderPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
}

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id');

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!orderId) {
            router.replace('/');
            return;
        }
        getOrderById(orderId)
            .then((res) => {
                const doc = res?.data?.doc ?? res?.data ?? res;
                setOrder(doc);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [orderId, router]);

    const subtotal = order
        ? order.totalOrderPrice - order.taxValue - order.shippingValue
        : 0;

    if (loading) {
        return (
            <main><Container className="py-20 flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-[#DB4444] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading your order...</p>
            </Container></main>
        );
    }

    if (error || !order) {
        return (
            <main><Container className="py-20 text-center">
                <p className="text-gray-500 mb-4">Could not load order details.</p>
                <Link
                    href="/"
                    className="inline-block bg-[#DB4444] hover:bg-red-600 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                >
                    Back to Home
                </Link>
            </Container></main>
        );
    }

    return (
        <main><Container className="py-10">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-10">
                {['Account', 'My Account', 'Product', 'View Cart', 'CheckOut', 'Order Placed'].map((crumb, i, arr) => (
                    <span key={crumb} className="flex items-center gap-2">
                        <span className={i === arr.length - 1 ? 'text-gray-900 font-medium' : ''}>
                            {crumb}
                        </span>
                        {i < arr.length - 1 && <span>/</span>}
                    </span>
                ))}
            </nav>

            {/* Success Header */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Order Placed Successfully!</h1>
                <p className="text-gray-500 text-sm">
                    Thank you for your order. We&apos;ll start processing it right away.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Order ID:{' '}
                    <span className="font-mono text-gray-600">
                        {order._id}
                    </span>
                </p>
            </div>

            {/* Order Items */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-700">
                        Items Ordered ({order.cartItems.length})
                    </h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {order.cartItems.map((item) => {
                        const image =
                            item.product?.coverImage ??
                            item.product?.images?.[0] ??
                            '';
                        return (
                            <div key={item._id} className="flex items-center gap-4 px-4 py-4">
                                <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-100">
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt={item.product?.name ?? ''}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.product?.name}
                                    </p>
                                    {item.color && (
                                        <p className="text-xs text-gray-400 mt-0.5">Color: {item.color}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Price Breakdown + Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Price Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Order Summary</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>
                                {order.shippingValue === 0
                                    ? <span className="text-green-600">Free</span>
                                    : `$${order.shippingValue.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>${order.taxValue.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between font-semibold text-gray-900">
                            <span>Total</span>
                            <span className="text-[#DB4444]">${order.totalOrderPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Order Status */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Order Status</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Payment</span>
                            <span className="capitalize font-medium text-gray-900">
                                {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Delivery</span>
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium
                                ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {order.isDelivered ? '✓ Delivered' : '⏳ Processing'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Payment Status</span>
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium
                                ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {order.isPaid ? '✓ Paid' : 'Pending'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Order Date</span>
                            <span className="text-gray-900 text-xs">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/account/orders"
                    className="w-full sm:flex-1 h-14 sm:h-12 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded
                               flex items-center justify-center transition-colors text-sm"
                >
                    View My Orders
                </Link>
                <Link
                    href="/"
                    className="w-full sm:flex-1 h-14 sm:h-12 bg-[#DB4444] hover:bg-red-600 text-white font-medium rounded
                               flex items-center justify-center transition-colors text-sm"
                >
                    Continue Shopping
                </Link>
            </div>
        </Container></main>
    );
}