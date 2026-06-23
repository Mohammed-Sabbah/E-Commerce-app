"use client";

import { useState, useMemo } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminOrder } from "@/types/admin";
import { STATUS_STYLES, formatId } from "@/constants/orders";
import { formatDate } from "@/lib/utils";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";
import LoadingSkeleton from "./LoadingSkeleton";

const STATUSES = ["all", "pending", "processing", "delivered", "cancelled", "returned"];

const PAGE_SIZE = 15;

export default function AdminOrdersClient({ initial }: { initial: AdminOrder[] }) {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState<{ id: string; status: string } | null>(null);

    const { data: orders = initial, isLoading } = useQuery({
        queryKey: ["admin", "orders"],
        queryFn: async () => {
            const res = await apiClient.get("/api/v1/orders?limit=1000&sort=-createdAt");
            return res.data?.data?.docs ?? [];
        },
        initialData: initial,
        staleTime: 30000,
    });

    const filtered = useMemo(() => {
        if (filter === "all") return orders;
        return orders.filter((o: AdminOrder) => o.status === filter);
    }, [orders, filter]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const statusLabels: Record<string, string> = {
        pending: "Pending",
        processing: "Processing",
        delivered: "Delivered",
        cancelled: "Cancelled",
        returned: "Returned",
    };

    const doAction = async (id: string, status: string) => {
        setActionId(id);
        setError("");
        try {
            if (status === "paid") {
                await apiClient.patch(`/api/v1/orders/${id}/pay`);
            } else if (status === "delivered") {
                await apiClient.patch(`/api/v1/orders/${id}/deliver`);
            } else {
                await apiClient.patch(`/api/v1/orders/${id}/status`, { status });
            }
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
        } catch (e: unknown) {
            setError(parseError(e));
        } finally {
            setActionId(null);
            setConfirm(null);
        }
    };

    if (isLoading && !orders.length) return <LoadingSkeleton rows={10} />;

    return (
        <div>
            {/* Error */}
            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => { setFilter(s); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer capitalize ${
                            filter === s
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {s === "all" ? "All" : statusLabels[s] ?? s}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Order</th>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Payment</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paged.map((order: AdminOrder) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                    {formatId(order._id)}
                                </td>
                                <td className="px-4 py-3 text-gray-900">
                                    {order.user?.name ?? "Unknown"}
                                </td>
                                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    ${order.totalOrderPrice?.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 capitalize">
                                    {order.paymentMethod}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                            STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {/* Pay button */}
                                        {!order.isPaid && order.paymentMethod === "cash" && (
                                            <button
                                                type="button"
                                                disabled={actionId === order._id}
                                                onClick={() => setConfirm({ id: order._id, status: "paid" })}
                                                className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
                                            >
                                                {actionId === order._id ? "..." : "Pay"}
                                            </button>
                                        )}
                                        {/* Deliver button */}
                                        {order.isPaid && !order.isDelivered && (
                                            <button
                                                type="button"
                                                disabled={actionId === order._id}
                                                onClick={() => setConfirm({ id: order._id, status: "delivered" })}
                                                className="h-8 px-3 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-40 transition-colors cursor-pointer"
                                            >
                                                {actionId === order._id ? "..." : "Deliver"}
                                            </button>
                                        )}
                                        {/* Status dropdown */}
                                        {order.isDelivered || order.status === "cancelled" || order.status === "returned" ? (
                                            <span className="text-xs text-gray-400">--</span>
                                        ) : (
                                            <select
                                                value=""
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val) setConfirm({ id: order._id, status: val });
                                                    e.target.value = "";
                                                }}
                                                className="h-8 px-2 rounded-md border border-gray-300 text-xs bg-white cursor-pointer"
                                            >
                                                <option value="" disabled>Change</option>
                                                {["processing", "cancelled"].map((s) => (
                                                    <option key={s} value={s}>
                                                        Mark {s}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paged.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-10">No orders found</p>
                )}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <ConfirmDialog
                open={!!confirm}
                title={confirm ? `Mark as ${statusLabels[confirm.status] ?? confirm.status}?` : ""}
                message="This action will update the order status."
                confirmLabel={confirm ? statusLabels[confirm.status] ?? confirm.status : ""}
                onConfirm={() => confirm && doAction(confirm.id, confirm.status)}
                onCancel={() => setConfirm(null)}
            />
        </div>
    );
}
