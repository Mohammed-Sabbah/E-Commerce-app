"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AdminCoupon } from "@/types/admin";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
    initial: AdminCoupon[];
}

function isExpired(expire: string) {
    return new Date(expire) < new Date();
}

function toDateInput(d: string) {
    return d.split("T")[0];
}

interface FormState {
    name: string;
    discount: string;
    expire: string;
}

const EMPTY: FormState = { name: "", discount: "", expire: "" };

const PAGE_SIZE = 15;

export default function AdminCouponsClient({ initial }: Props) {
    const t = useTranslations('admin');
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const { data: coupons = initial } = useQuery({
        queryKey: ["admin", "coupons"],
        queryFn: async () => {
            const res = await apiClient.get("/api/v1/coupons?limit=1000&sort=-createdAt");
            return res.data?.data?.docs ?? [];
        },
        initialData: initial,
        staleTime: 30000,
    });

    const totalPages = Math.ceil(coupons.length / PAGE_SIZE);
    const paged = coupons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const openEdit = (c: AdminCoupon) => {
        setForm({ name: c.name, discount: String(c.discount), expire: toDateInput(c.expire) });
        setEditing(c._id);
    };

    const resetForm = () => setForm(EMPTY);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                name: form.name.toUpperCase(),
                discount: Number(form.discount),
                expire: form.expire,
            };
            if (editing && editing !== "new") {
                await apiClient.patch(`/api/v1/coupons/${editing}`, payload);
            } else {
                await apiClient.post("/api/v1/coupons", payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
            setEditing(null);
            resetForm();
            toast.success(t("couponSaved"));
        },
        onError: (e: unknown) => toast.error(parseError(e)),
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!deleteTarget) return;
            await apiClient.delete(`/api/v1/coupons/${deleteTarget}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
            setDeleteTarget(null);
            toast.success(t("couponDeleted"));
        },
        onError: (e: unknown) => {
            toast.error(parseError(e));
            setDeleteTarget(null);
        },
    });

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <button
                    type="button"
                    onClick={() => { setEditing("new"); resetForm(); }}
                    className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    + {t('addCoupon')}
                </button>
            </div>

            {/* Create/Edit form */}
            {editing && (
                <div className="border border-gray-200 rounded-xl bg-white p-5 mb-4 space-y-3">
                    <div className="flex flex-wrap gap-3">
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('couponName')} className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-40" />
                        <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder={t('couponDiscount')} type="number" min={1} max={100} className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-36" />
                        <input value={form.expire} onChange={(e) => setForm({ ...form, expire: e.target.value })} type="date" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-40" />
                        <button type="button" onClick={() => saveMutation.mutate()} disabled={!form.name || !form.discount || !form.expire || saveMutation.isPending} className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer">
                            {saveMutation.isPending ? t('saving') : editing === "new" ? t('create') : t('update')}
                        </button>
                        <button type="button" onClick={() => { setEditing(null); resetForm(); }} className="h-10 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">{t('cancel')}</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-start text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">{t('couponName')}</th>
                            <th className="px-4 py-3 font-medium">{t('couponDiscount')}</th>
                            <th className="px-4 py-3 font-medium">{t('couponExpire')}</th>
                            <th className="px-4 py-3 font-medium">{t('status')}</th>
                            <th className="px-4 py-3 font-medium">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paged.map((c: AdminCoupon) => (
                            <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{c.name}</td>
                                <td className="px-4 py-3">{c.discount}%</td>
                                <td className="px-4 py-3 text-gray-500">{toDateInput(c.expire)}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                        isExpired(c.expire) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    }`}>
                                        {isExpired(c.expire) ? t('expired') : t('active')}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => openEdit(c)} className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer">{t('edit')}</button>
                                        <button type="button" onClick={() => setDeleteTarget(c._id)} className="h-8 px-3 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer">{t('delete')}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paged.length === 0 && <p className="text-center text-sm text-gray-400 py-10">{t('noCoupons')}</p>}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <ConfirmDialog open={!!deleteTarget} title={t('confirmDeleteTitle')} message={t('confirmDeleteMessage')} confirmLabel={t('yesDelete')} danger onConfirm={() => deleteMutation.mutate()} onCancel={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </div>
    );
}
