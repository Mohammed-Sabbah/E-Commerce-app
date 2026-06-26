"use client";

import { useState, useMemo } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import type { Product, Category, Brand, PopulatedRef } from "@/types/api";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";
import ProductFormModal from "./ProductFormModal";

interface Props {
    initialProducts: Product[];
    categories: Category[];
    brands: Brand[];
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
    const [modalOpen, setModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
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

    const openCreate = () => {
        setEditProduct(null);
        setModalOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditProduct(p);
        setModalOpen(true);
    };

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!deleteTarget) return;
            await apiClient.delete(`/api/v1/products/${deleteTarget}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            setDeleteTarget(null);
            toast.success("Product deleted");
        },
        onError: (e: unknown) => {
            toast.error(parseError(e));
            setDeleteTarget(null);
        },
    });

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search products..."
                    className="flex-1 min-w-[200px] h-10 px-3 border border-gray-300 rounded-lg text-sm"
                />
                <button
                    type="button"
                    onClick={openCreate}
                    className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    + New Product
                </button>
            </div>

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

            <ProductFormModal
                open={modalOpen}
                onClose={() => { setModalOpen(false); setEditProduct(null); }}
                product={editProduct}
                categories={categories}
                brands={brands}
            />
        </div>
    );
}
