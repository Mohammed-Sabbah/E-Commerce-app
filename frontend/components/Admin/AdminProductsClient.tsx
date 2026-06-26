"use client";

import { useState, useMemo, useRef } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
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

function FileInput({ current, file, onChange, onRemove, onRemoveCurrent, removingCurrent }: {
    current?: string;
    file: File | null;
    onChange: (f: File | null) => void;
    onRemove: () => void;
    onRemoveCurrent?: () => void;
    removingCurrent?: boolean;
}) {
    const ref = useRef<HTMLInputElement>(null);

    const handleRemove = () => {
        if (file) {
            onRemove();
        } else if (current && onRemoveCurrent) {
            onRemoveCurrent();
        }
    };

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
                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={removingCurrent}
                    className="text-xs text-red-500 hover:text-red-700 underline cursor-pointer disabled:opacity-40"
                >
                    {removingCurrent ? "Removing..." : "Remove"}
                </button>
            )}
        </div>
    );
}

function MultiImageInput({ files, existing, onChange, onRemoveExisting }: {
    files: File[];
    existing: string[];
    onChange: (files: File[]) => void;
    onRemoveExisting: (url: string) => void;
}) {
    const ref = useRef<HTMLInputElement>(null);

    const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        const total = files.length + existing.length + selected.length;
        if (total > 5) {
            alert("Maximum 5 additional images allowed");
            return;
        }
        onChange([...files, ...selected]);
        if (ref.current) ref.current.value = "";
    };

    const removeNew = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {existing.map((url, i) => (
                    <div key={`ex-${i}`} className="relative w-14 h-14 rounded-md overflow-hidden border border-gray-200 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onRemoveExisting(url)}
                            className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                {files.map((file, i) => (
                    <div key={`new-${i}`} className="relative w-14 h-14 rounded-md overflow-hidden border border-blue-200 group">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeNew(i)}
                            className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                {(files.length + existing.length) < 5 && (
                    <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        className="w-14 h-14 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors text-xl flex items-center justify-center cursor-pointer"
                    >
                        +
                    </button>
                )}
            </div>
            <input ref={ref} type="file" accept="image/*" multiple onChange={handleAdd} className="hidden" />
            <p className="text-xs text-gray-400">{files.length + existing.length}/5 additional images</p>
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
    const [extraFiles, setExtraFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
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

    const resetForm = () => { setForm(EMPTY_FORM); setCoverFile(null); setExtraFiles([]); setExistingImages([]); };

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
        setExtraFiles([]);
        setExistingImages(p.images ?? []);
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

    const saveMutation = useMutation({
        mutationFn: async () => {
            const priceErr = validatePrice();
            if (priceErr) throw new Error(priceErr);
            if (descError) throw new Error("Description must be at least 20 characters");

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
            extraFiles.forEach((f) => fd.append("images", f));
            fd.append("existingImages", JSON.stringify(existingImages));

            if (editing) {
                await apiClient.patch(`/api/v1/products/${editing}`, fd);
            } else {
                if (!coverFile) throw new Error("Product cover image is required");
                await apiClient.post("/api/v1/products", fd);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            setEditing(null);
            setCreating(false);
            resetForm();
            setError("");
        },
        onError: (e: unknown) => setError(parseError(e)),
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!deleteTarget) return;
            await apiClient.delete(`/api/v1/products/${deleteTarget}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            setDeleteTarget(null);
        },
        onError: (e: unknown) => {
            setError(parseError(e));
            setDeleteTarget(null);
        },
    });

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
                            <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
                            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Discounted Price ($)</label>
                            <input value={form.priceAfterDiscount} onChange={(e) => setForm({ ...form, priceAfterDiscount: e.target.value })} placeholder="Discounted price" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                            <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Qty" type="number" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (min 20 characters)" rows={2} className="h-10 px-3 border border-gray-300 rounded-lg text-sm pt-2 w-full" />
                            {descError && <p className="text-xs text-red-500 mt-1">Description must be at least 20 characters</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white w-full">
                                <option value="">Select Category</option>
                                {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Brand</label>
                            <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white w-full">
                                <option value="">Select Brand</option>
                                {brands.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Colors (comma separated)</label>
                            <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="e.g. Red, Blue, Green" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Cover Image</label>
                            <FileInput
                                current={!creating && activeProduct ? activeProduct.coverImage : undefined}
                                file={coverFile}
                                onChange={setCoverFile}
                                onRemove={() => setCoverFile(null)}
                                onRemoveCurrent={editing ? handleRemoveCover : undefined}
                                removingCurrent={removingCover}
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Additional Images (max 5)</label>
                            <MultiImageInput
                                files={extraFiles}
                                existing={existingImages}
                                onChange={setExtraFiles}
                                onRemoveExisting={(url) => setExistingImages(existingImages.filter((u) => u !== url))}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setCreating(false); setEditing(null); resetForm(); }} className="h-9 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                        <button type="button" onClick={() => saveMutation.mutate()} disabled={!form.name || !form.price || saveMutation.isPending} className="h-9 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer">
                            {saveMutation.isPending ? "Saving..." : editing ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Image</th>
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
                                <td className="px-4 py-3">
                                    {p.coverImage ? (
                                        <div className="w-10 h-10 relative rounded-md overflow-hidden border border-gray-200">
                                            <Image
                                                src={p.coverImage.startsWith("http") ? p.coverImage : `${process.env.NEXT_PUBLIC_API_URL}/${p.coverImage}`}
                                                alt={p.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </td>
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

            <ConfirmDialog open={!!deleteTarget} title="Delete product?" message="This cannot be undone." confirmLabel="Delete" danger onConfirm={() => deleteMutation.mutate()} onCancel={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </div>
    );
}
