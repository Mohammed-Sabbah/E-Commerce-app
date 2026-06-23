"use client";

import { useState, useMemo } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, Category, Brand, PopulatedRef } from "@/types/api";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
    initialProducts: Product[];
    categories: Category[];
    brands: Brand[];
}

interface FormState {
    name: string;
    description: string;
    price: string;
    priceAfterDiscount: string;
    quantity: string;
    category: string;
    brand: string;
    colors: string;
}

const EMPTY_FORM: FormState = {
    name: "", description: "", price: "", priceAfterDiscount: "",
    quantity: "1", category: "", brand: "", colors: "",
};

function refId(v: PopulatedRef | string | null | undefined): string {
    if (!v) return "";
    return typeof v === "string" ? v : v._id;
}

function refName(v: PopulatedRef | string | null | undefined): string {
    if (!v) return "";
    return typeof v === "string" ? v : v.name;
}

const PAGE_SIZE = 15;

export default function AdminProductsClient({ initialProducts, categories, brands }: Props) {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const { data: products = initialProducts } = useQuery({
        queryKey: ["admin", "products"],
        queryFn: async () => {
            const res = await apiClient.get("/api/v1/products?limit=1000&sort=-createdAt");
            return res.data?.data?.docs ?? [];
        },
        initialData: initialProducts,
        staleTime: 30000,
    });

    const filtered = useMemo(() => {
        if (!search.trim()) return products;
        const q = search.toLowerCase();
        return products.filter((p: Product) => p.name.toLowerCase().includes(q));
    }, [products, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const resetForm = () => setForm(EMPTY_FORM);

    const openEdit = (p: Product) => {
        setForm({
            name: p.name,
            description: p.description,
            price: String(p.price),
            priceAfterDiscount: p.priceAfterDiscount ? String(p.priceAfterDiscount) : "",
            quantity: String(p.quantity),
            category: refId(p.category),
            brand: refId(p.brand),
            colors: (p.colors ?? []).join(", "),
        });
        setEditing(p._id);
        setCreating(false);
    };

    const handleSave = async () => {
        setError("");
        const payload: Record<string, unknown> = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            quantity: Number(form.quantity),
            category: form.category,
        };
        if (form.brand) payload.brand = form.brand;
        if (form.priceAfterDiscount) payload.priceAfterDiscount = Number(form.priceAfterDiscount);
        if (form.colors.trim()) payload.colors = form.colors.split(",").map((c) => c.trim());

        try {
            if (editing) {
                await apiClient.patch(`/api/v1/products/${editing}`, payload);
            } else {
                await apiClient.post("/api/v1/products", payload);
            }
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            setEditing(null);
            setCreating(false);
            resetForm();
        } catch (e: unknown) {
            setError(parseError(e));
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError("");
        try {
            await apiClient.delete(`/api/v1/products/${deleteTarget}`);
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        } catch (e: unknown) {
            setError(parseError(e));
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                    <span>{error}</span>
                    <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-bold cursor-pointer">&times;</button>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search products..."
                    className="flex-1 min-w-[200px] h-10 px-3 border border-gray-300 rounded-lg text-sm"
                />
                <button
                    type="button"
                    onClick={() => { setCreating(true); setEditing(null); resetForm(); }}
                    className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    + New Product
                </button>
            </div>

            {/* Create/Edit form */}
            {(creating || editing) && (
                <div className="border border-gray-200 rounded-xl bg-white p-5 mb-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="h-10 px-3 border border-gray-300 rounded-lg text-sm" />
                        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm" />
                        <input value={form.priceAfterDiscount} onChange={(e) => setForm({ ...form, priceAfterDiscount: e.target.value })} placeholder="Discounted price" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm" />
                        <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Qty" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm" />
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="h-10 px-3 border border-gray-300 rounded-lg text-sm pt-2 md:col-span-2" />
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white">
                            <option value="">Category</option>
                            {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                        </select>
                        <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white">
                            <option value="">Brand</option>
                            {brands.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                        </select>
                        <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Colors (comma separated)" className="h-10 px-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setCreating(false); setEditing(null); resetForm(); }} className="h-9 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                        <button type="button" onClick={handleSave} disabled={!form.name || !form.price} className="h-9 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer">
                            {editing ? "Update" : "Create"}
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Brand</th>
                            <th className="px-4 py-3 font-medium">Price</th>
                            <th className="px-4 py-3 font-medium">Stock</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paged.map((p: Product) => (
                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{p.name}</td>
                                <td className="px-4 py-3 text-gray-500">{refName(p.category)}</td>
                                <td className="px-4 py-3 text-gray-500">{refName(p.brand)}</td>
                                <td className="px-4 py-3">
                                    <span className="font-medium">${p.price}</span>
                                    {p.priceAfterDiscount && <span className="text-xs text-gray-400 line-through ml-1">${p.priceAfterDiscount}</span>}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {p.quantity > 0 ? `${p.quantity} in stock` : "Out of stock"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => openEdit(p)} className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer">Edit</button>
                                        <button type="button" onClick={() => setDeleteTarget(p._id)} className="h-8 px-3 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paged.length === 0 && <p className="text-center text-sm text-gray-400 py-10">No products found</p>}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <ConfirmDialog open={!!deleteTarget} title="Delete product?" message="This cannot be undone." confirmLabel="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </div>
    );
}
