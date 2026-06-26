"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminOrder } from "@/types/admin";
import { STATUS_STYLES, formatId } from "@/constants/orders";
import { formatDate } from "@/lib/utils";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";
import LoadingSkeleton from "./LoadingSkeleton";

const STATUSES = ["all", "pending", "processing", "delivered", "cancelled", "returned"];
const PAGE_SIZE = 15;

const DESTRUCTIVE = new Set(["cancelled", "returned"]);

const isTerminal = (s: string) => s === "cancelled" || s === "returned";
const canPay = (o: AdminOrder) => !o.isPaid && !isTerminal(o.status);

const TRANSITIONS: Record<string, string[]> = {
    pending:    ["processing", "cancelled"],
    processing: ["delivered", "cancelled"],
    delivered:  ["returned"],
    cancelled:  [],
    returned:   [],
};

export default function AdminOrdersClient({ initial }: { initial: AdminOrder[] }) {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);

    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState<{ id: string; status: string } | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        if (!openId) return;
        const close = () => setOpenId(null);
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [openId]);

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

    const actionMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            if (status === "paid") {
                await apiClient.patch(`/api/v1/orders/${id}/pay`);
            } else {
                await apiClient.patch(`/api/v1/orders/${id}/status`, { status });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            setConfirm(null);
        },
        onError: (e: unknown) => setError(parseError(e)),
    });

    const doAction = (id: string, status: string) => actionMutation.mutate({ id, status });

    const requestAction = (id: string, status: string) => {
        if (DESTRUCTIVE.has(status)) {
            setConfirm({ id, status });
        } else {
            doAction(id, status);
        }
    };

    if (isLoading && !orders.length) return <LoadingSkeleton rows={10} />;

    return (
        <div>
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
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="capitalize text-gray-600">{order.paymentMethod}</span>
                                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none ${
                                            order.isPaid
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                            {order.isPaid ? "Paid" : "Unpaid"}
                                        </span>
                                    </div>
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
                                    <div className="flex items-center gap-1.5">
                                        {canPay(order) && (
                                            <button
                                                type="button"
                                                disabled={actionMutation.isPending && actionMutation.variables?.id === order._id}
                                                onClick={() => doAction(order._id, "paid")}
                                                className="h-7 px-2.5 rounded-md bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
                                            >
                                                {actionMutation.isPending && actionMutation.variables?.id === order._id ? "..." : "Pay"}
                                            </button>
                                        )}

                                        {(() => {
                                            const options = TRANSITIONS[order.status] ?? [];
                                            if (options.length === 0) return <span className="text-xs text-gray-300 select-none">——</span>;

                                            const safe = options.filter((s) => !DESTRUCTIVE.has(s));
                                            const danger = options.filter((s) => DESTRUCTIVE.has(s));
                                            const loading = actionMutation.isPending && actionMutation.variables?.id === order._id;

                                            return (
                                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        disabled={loading}
                                                        onClick={() => setOpenId(openId === order._id ? null : order._id)}
                                                        className={`h-7 px-2 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-40 ${
                                                            openId === order._id
                                                                ? "bg-gray-100 border border-gray-300 text-gray-700"
                                                                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <span>Actions</span>
                                                        <ChevronDown className={`w-3 h-3 transition-transform ${openId === order._id ? "rotate-180" : ""}`} />
                                                    </button>

                                                    {openId === order._id && (
                                                        <div className="absolute right-0 top-full mt-1 z-50 min-w-[150px] bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                                            {safe.map((s) => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => { setOpenId(null); doAction(order._id, s); }}
                                                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                                                >
                                                                    Mark {statusLabels[s]}
                                                                </button>
                                                            ))}
                                                            {safe.length > 0 && danger.length > 0 && (
                                                                <div className="h-px bg-gray-100 my-1" />
                                                            )}
                                                            {danger.map((s) => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => { setOpenId(null); requestAction(order._id, s); }}
                                                                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                                >
                                                                    {s === "cancelled" ? "Cancel" : statusLabels[s]}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
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
                title={
                    confirm?.status === "cancelled"
                        ? "Cancel order?"
                        : confirm?.status === "returned"
                        ? "Return order?"
                        : ""
                }
                message={
                    confirm?.status === "cancelled"
                        ? "This will cancel the order. This action cannot be undone."
                        : confirm?.status === "returned"
                        ? "This will process a return for this order."
                        : ""
                }
                confirmLabel={confirm ? statusLabels[confirm.status] ?? confirm.status : ""}
                danger={confirm?.status === "cancelled"}
                onConfirm={() => confirm && doAction(confirm.id, confirm.status)}
                onCancel={() => setConfirm(null)}
                loading={actionMutation.isPending}
            />
        </div>
    );
}
