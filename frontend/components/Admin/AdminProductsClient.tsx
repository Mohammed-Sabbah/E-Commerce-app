"use client";

import { useState, useMemo, useRef } from "react";
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

function FileInput({ current, file, onChange, onRemove }: { current?: string; file: File | null; onChange: (f: File | null) => void; onRemove: () => void }) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div className="flex items-center gap-2">
            <input ref={ref} type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0] ?? null)} className="hidden" />
            <button type="button" onClick={() => ref.current?.click()} className="h-8 px-3 rounded-md border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                Choose Image
            </button>
            {file ? (
                <span className="text-xs text-blue-600">{file.name}</span>
            ) : current ? (
                <span className="text-xs text-gray-500">Current: {current.split("/").pop()}</span>
            ) : (
                <span className="text-xs text-gray-400">No file chosen</span>
            )}
            {(file || current) && (
                <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:text-red-700 underline cursor-pointer">Remove</button>
            )}
        </div>
    );
}

export default function AdminProductsClient({ initialProducts, categories, brands }: Props) {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [removingCover, setRemovingCover] = useState(false);

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

    const resetForm = () => { setForm(EMPTY_FORM); setCoverFile(null); };

    const activeProduct = editing ? products.find((p: Product) => p._id === editing) : null;

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
        setCoverFile(null);
        setEditing(p._id);
        setCreating(false);
    };

    const validatePrice = (): string | null => {
        const price = Number(form.price);
        const discount = Number(form.priceAfterDiscount);
        if (form.priceAfterDiscount && discount >= price) {
            return "Discounted price must be less than price";
        }
        return null;
    };

    const descError = form.description.trim() && form.description.trim().length < 20;

    const handleSave = async () => {
        setError("");
        const priceErr = validatePrice();
        if (priceErr) { setError(priceErr); return; }
        if (descError) { setError("Description must be at least 20 characters"); return; }

        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("quantity", form.quantity);
        fd.append("category", form.category);
        if (form.brand) fd.append("brand", form.brand);
        if (form.priceAfterDiscount) fd.append("priceAfterDiscount", form.priceAfterDiscount);
        if (form.colors.trim()) {
            form.colors.split(",").map(c => c.trim()).filter(Boolean).forEach((c) => fd.append("colors", c));
        }
        if (coverFile) fd.append("coverImage", coverFile);

        try {
            if (editing) {
                await apiClient.patch(`/api/v1/products/${editing}`, fd);
            } else {
                if (!coverFile) { setError("Product cover image is required"); return; }
                await apiClient.post("/api/v1/products", fd);
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

    const handleRemoveCover = async () => {
        if (!editing) return;
        setRemovingCover(true);
        setError("");
        try {
            await apiClient.patch(`/api/v1/admin/products/${editing}/remove-cover`);
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        } catch (e: unknown) {
            setError(parseError(e));
        } finally {
            setRemovingCover(false);
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

            {(creating || editing) && (
                <div className="border border-gray-200 rounded-xl bg-white p-5 mb-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div>
                            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div>
                            <input value={form.priceAfterDiscount} onChange={(e) => setForm({ ...form, priceAfterDiscount: e.target.value })} placeholder="Discounted price" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div>
                            <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Qty" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div className="md:col-span-2">
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (min 20 characters)" rows={2} className="h-10 px-3 border border-gray-300 rounded-lg text-sm pt-2 w-full" />
                            {descError && <p className="text-xs text-red-500 mt-1">Description must be at least 20 characters</p>}
                        </div>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white">
                            <option value="">Category</option>
                            {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                        </select>
                        <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white">
                            <option value="">Brand</option>
                            {brands.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                        </select>
                        <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Colors (comma separated)" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        <div className="flex flex-wrap items-center gap-2">
                            <FileInput
                                current={!creating && activeProduct ? activeProduct.coverImage : undefined}
                                file={coverFile}
                                onChange={setCoverFile}
                                onRemove={() => setCoverFile(null)}
                            />
                            {editing && activeProduct?.coverImage && (
                                <button type="button" onClick={handleRemoveCover} disabled={removingCover} className="text-xs text-red-500 hover:text-red-700 underline whitespace-nowrap cursor-pointer disabled:opacity-40">
                                    {removingCover ? "Removing..." : "Remove cover"}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setCreating(false); setEditing(null); resetForm(); }} className="h-9 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                        <button type="button" onClick={handleSave} disabled={!form.name || !form.price} className="h-9 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer">
                            {editing ? "Update" : "Create"}
                        </button>
                    </div>
                </div>
            )}

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
                                    {p.priceAfterDiscount ? (
                                        <>
                                            <span className="font-medium">${p.priceAfterDiscount}</span>
                                            <span className="text-xs text-gray-400 line-through ml-1">${p.price}</span>
                                        </>
                                    ) : (
                                        <span className="font-medium">${p.price}</span>
                                    )}
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
