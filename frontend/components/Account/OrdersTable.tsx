"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import { Order, OrderFilter } from "@/types/Order";
import { STATUS_STYLES, formatId } from "@/constants/orders";
import { formatDate } from "@/lib/utils";

const TAB_VALUES: OrderFilter[] = ["all", "active", "cancelled", "returned"];

function filterOrders(orders: Order[], filter: OrderFilter): Order[] {
    if (filter === "all") return orders;
    if (filter === "active") return orders.filter(o => ["pending", "processing", "delivered"].includes(o.status));
    return orders.filter(o => o.status === filter);
}

function ExpandedItems({ order, tCheckout, tAccount }: { order: Order; tCheckout: (key: string) => string; tAccount: (key: string) => string }) {
    const subtotal = order.orderPrice ?? (order.totalOrderPrice - (order.taxValue ?? 0) - (order.shippingValue ?? 0));

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3 mb-4">
                {order.cartItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-white border border-gray-100">
                            <Image src={item.product.coverImage} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <span className="flex-1 text-sm text-gray-700">{item.product.name}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            {item.color && (
                                <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{item.color}</span>
                            )}
                            <span>×{item.quantity}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-16 text-right">${item.price.toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{tCheckout("subtotal")}</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{tCheckout("tax")}</span><span>${(order.taxValue ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{tCheckout("shipping")}</span>
                    <span>
                        {(order.shippingValue ?? 0) === 0
                            ? <span className="text-green-600">{tAccount("free")}</span>
                            : `$${order.shippingValue!.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-800 border-t border-gray-200 pt-2 mt-1">
                    <span>{tCheckout("total")}</span>
                    <span className="text-[#DB4444]">${order.totalOrderPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const t = useTranslations("account");
    const tc = useTranslations("checkout");
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const TABS: { label: string; value: OrderFilter }[] = [
        { label: t("allOrders"), value: "all" },
        { label: t("activeOrders"), value: "active" },
        { label: t("cancelledOrders"), value: "cancelled" },
        { label: t("returnedOrders"), value: "returned" },
    ];

    const activeFilter = (searchParams.get("filter") ?? "all") as OrderFilter;

    function setActiveFilter(value: OrderFilter) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") params.delete("filter");
        else params.set("filter", value);
        router.replace(`${pathname}?${params.toString()}`);
    }

    const filtered = filterOrders(orders, activeFilter);

    function toggleExpand(id: string) {
        setExpandedId(prev => prev === id ? null : id);
    }

    async function handleAction(id: string, action: "cancel" | "return") {
        setLoadingId(id);
        setError(null);
        try {
            await apiClient.patch(`/api/v1/orders/${id}/${action}`);
            setOrders(prev =>
                prev.map(o => o._id === id
                    ? { ...o, status: action === "cancel" ? "cancelled" : "returned" }
                    : o
                )
            );
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            setError(e?.response?.data?.message ?? "Something went wrong.");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div>
            <h2 className="text-[#DB4444] font-medium text-xl mb-6">{t("myOrders")}</h2>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
                {TABS.map(tab => (
                    <button key={tab.value} onClick={() => setActiveFilter(tab.value)}
                        className={`pb-2 text-sm font-medium transition border-b-2 -mb-px ${activeFilter === tab.value
                            ? "border-[#DB4444] text-[#DB4444]"
                            : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {error}
                </div>
            )}

            {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-16">{t("noOrdersFound")}</p>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-200">
                                    <th className="pb-3 font-medium">{t("order")}</th>
                                    <th className="pb-3 font-medium">{t("orderDate")}</th>
                                    <th className="pb-3 font-medium">{t("orderItems")}</th>
                                    <th className="pb-3 font-medium">{tc("total")}</th>
                                    <th className="pb-3 font-medium">{t("orderStatus")}</th>
                                    <th className="pb-3 font-medium">{t("action")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(order => (
                                    <Fragment key={order._id}>
                                        <tr className="hover:bg-gray-50 transition">
                                            <td className="py-4 font-mono text-gray-700">{formatId(order._id)}</td>
                                            <td className="py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                                            <td className="py-4">
                                                <button onClick={() => toggleExpand(order._id)}
                                                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition">
                                                    {order.cartItems.length} item{order.cartItems.length > 1 ? "s" : ""}
                                                    <span className={`text-xs transition-transform inline-block ${expandedId === order._id ? "rotate-180" : ""}`}>▼</span>
                                                </button>
                                            </td>
                                            <td className="py-4 font-medium">${order.totalOrderPrice.toFixed(2)}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                {order.status === "pending" && (
                                                    <button onClick={() => handleAction(order._id, "cancel")}
                                                        disabled={loadingId === order._id}
                                                        className="text-xs text-red-500 hover:text-red-700 transition disabled:opacity-50">
                                        {loadingId === order._id ? "..." : t("cancelOrder")}
                                    </button>
                                )}
                                {order.status === "delivered" && (
                                    <button onClick={() => handleAction(order._id, "return")}
                                        disabled={loadingId === order._id}
                                        className="text-xs text-gray-500 hover:text-gray-700 transition disabled:opacity-50">
                                        {loadingId === order._id ? "..." : t("returnOrder")}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        {expandedId === order._id && (
                                            <tr key={`${order._id}-expanded`}>
                                                <td colSpan={6} className="pb-4 pt-0">
                                                    <ExpandedItems order={order} tCheckout={tc} tAccount={t} />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {filtered.map(order => (
                            <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-mono text-gray-700 font-medium">{formatId(order._id)}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <button onClick={() => toggleExpand(order._id)}
                                        className="flex items-center gap-1 text-sm text-gray-600">
                                        {order.cartItems.length} item{order.cartItems.length > 1 ? "s" : ""}
                                        <span className={`text-xs transition-transform inline-block ${expandedId === order._id ? "rotate-180" : ""}`}>▼</span>
                                    </button>
                                    <p className="font-medium text-gray-800">${order.totalOrderPrice.toFixed(2)}</p>
                                </div>
                                {expandedId === order._id && (
                                    <div className="mb-3"><ExpandedItems order={order} tCheckout={tc} tAccount={t} /></div>
                                )}
                                <div className="flex justify-end">
                                    {order.status === "pending" && (
                                        <button onClick={() => handleAction(order._id, "cancel")}
                                            disabled={loadingId === order._id}
                                            className="text-xs text-red-500 hover:text-red-700 transition disabled:opacity-50">
                                            {loadingId === order._id ? "..." : t("cancelOrder")}
                                        </button>
                                    )}
                                    {order.status === "delivered" && (
                                        <button onClick={() => handleAction(order._id, "return")}
                                            disabled={loadingId === order._id}
                                            className="text-xs text-gray-500 hover:text-gray-700 transition disabled:opacity-50">
                                            {loadingId === order._id ? "..." : t("returnOrder")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}