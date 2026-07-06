"use client";

import Container from "@/components/Container";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import type { CartItem } from "@/types/cart";
import CartEmptyState from "@/components/Cart/CartEmptyState";
import CartDesktopTable from "@/components/Cart/CartDesktopTable";
import CartMobileList from "@/components/Cart/CartMobileList";
import CartActions from "@/components/Cart/CartActions";
import CartSummary from "@/components/Cart/CartSummary";


export default function CartPage() {
    const router = useRouter();
    const { cart, isLoading, updateCartItem } = useCart();
    const [updates, setUpdates] = useState<Record<string, number>>({});

    const handleChange = (id: string, qty: number) => {
        setUpdates((prev) => ({ ...prev, [id]: qty }));
    };

    const handleUpdateCart = () => {
        Object.entries(updates).forEach(([id, quantity]) => {
            updateCartItem({ productId: id, quantity });
        });
        setUpdates({});
    };

    const handleProceedToCheckout = (couponCode?: string) => {
        const params = couponCode ? `?coupon=${encodeURIComponent(couponCode)}` : "";
        router.push(`/checkout${params}`);
    };

    if (isLoading) return <p className="text-center mt-10">Loading ...</p>;

    if (!cart?.cartItems?.length) {
        return (
            <section className="min-h-[60vh]">
                <Container>
                    <CartEmptyState />
                </Container>
            </section>
        );
    }

    const subtotal = cart.cartItems.reduce((acc: number, item: CartItem) => {
        const price = item.product.priceAfterDiscount ?? item.price;
        return acc + price * item.quantity;
    }, 0);

    return (
        <section className="py-10 min-h-[60vh]">
            <Container>
                <h1 className="text-xl sm:text-2xl font-semibold mb-8">
                    Cart ({cart.cartItems.length})
                </h1>

                <CartDesktopTable
                    cartItems={cart.cartItems}
                    onChange={handleChange}
                    updates={updates}
                />

                <CartMobileList
                    cartItems={cart.cartItems}
                    onChange={handleChange}
                    updates={updates}
                />

                <CartActions onUpdate={handleUpdateCart} />

                <CartSummary
                    subtotal={subtotal}
                    onCheckout={handleProceedToCheckout}
                />
            </Container>
        </section>
    );
}