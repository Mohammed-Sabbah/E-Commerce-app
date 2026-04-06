"use client";

import Container from "@/components/Container";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCart } from "@/hooks/useCart";
import ProductRow from "./ProductRow";
import { useState } from "react";
import Link from "next/link";
import ProductMobileCard from "./ProductMobileCard";

export default function CartPage() {
    const { cart, isLoading, updateCartItem } = useCart();
    const [updates, setUpdates] = useState<{ [key: string]: number }>({});

    const handleChange = (id: string, qty: number) => {
        setUpdates((prev) => ({
            ...prev,
            [id]: qty,
        }));
    };

    const handleUpdateCart = () => {
        Object.entries(updates).forEach(([id, quantity]) => {
            updateCartItem({
                productId: id,
                quantity,
            });
        });

        setUpdates({});
    };

    if (isLoading) return <p className="text-center mt-10">Loading ...</p>;

    if (!cart?.cartItems?.length)
        return <p className="text-center mt-10">Cart is empty</p>;

    const subtotal = cart.cartItems.reduce(
        (acc: number, cartItem: any) => {
            const price = cartItem.product.priceAfterDiscount ?? cartItem.price;
            
            return acc + price * cartItem.quantity

        },
        0
    );

    return (
        <section className="py-10">
            <Container>
                <h1 className="text-2xl font-semibold mb-8">
                    Cart ({cart.cartItems.length})
                </h1>

                {/* Desktop */}
                <div className="hidden md:block border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {cart.cartItems.map((item: any) => (
                                <ProductRow
                                    key={item._id}
                                    cartItem={item}
                                    onChange={handleChange}
                                    updates={updates}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-4">
                    {cart.cartItems.map((item: any) => (
                        <ProductMobileCard
                            key={item._id}
                            item={item}
                            onChange={handleChange}
                            updates={updates}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                    <Link
                        href="/"
                        className="border border-black rounded-md px-6 py-3 text-center hover:bg-black hover:text-white transition"
                    >
                        Return To Shop
                    </Link>

                    <button
                        onClick={handleUpdateCart}
                        className="border border-black rounded-md px-6 py-3 hover:bg-black hover:text-white transition cursor-pointer"
                    >
                        Update Cart
                    </button>
                </div>

                {/* Bottom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="flex gap-3">
                        <input
                            placeholder="Coupon Code"
                            className="border px-4 py-2 w-full rounded-md h-14"
                        />
                        <button className="bg-[#DB4444] text-white px-14 rounded-md h-14 cursor-pointer">
                            Apply
                        </button>
                    </div>

                    <div className="border rounded-xl p-6 w-full max-w-md md:ml-auto m-auto">
                        <h2 className="font-semibold mb-4">
                            Cart Total
                        </h2>

                        <div className="flex justify-between mb-2">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between mb-2">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>

                        <div className="flex justify-between border-t pt-3 font-bold">
                            <span>Total:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <button className="mt-5 w-full bg-[#DB4444] text-white py-3 rounded-md cursor-pointer">
                            Proceed to checkout
                        </button>
                    </div>
                </div>
            </Container>
        </section>
    );
}