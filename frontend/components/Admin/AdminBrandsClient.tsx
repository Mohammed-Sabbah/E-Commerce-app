"use client";

import { useState, useMemo, useRef } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import type { Brand } from "@/types/api";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
    initial: Brand[];
}

const PAGE_SIZE = 15;

export default function AdminBrandsClient({ initial }: Props) {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editFile, setEditFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { data: items = initial } = useQuery({
        queryKey: ["admin", "brands"],
        queryFn: async () => {
            const res = await apiClient.get("/api/v1/brands?limit=1000&sort=-createdAt");
            return res.data?.data?.docs ?? [];
        },
        initialData: initial,
        staleTime: 30000,
    });

    const filtered = useMemo(() => {
        if (!search.trim()) return items;
        return items.filter((b: Brand) => b.name.toLowerCase().includes(search.toLowerCase()));
    }, [items, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleEdit = (b: Brand) => {
        setEditing(b._id);
        setEditName(b.name);
        setEditFile(null);
    };

    const saveEdit = async () => {
        if (!editing || !editName.trim()) return;
        setError("");
        try {
            const fd = new FormData();
            fd.append("name", editName.trim());
            if (editFile) fd.append("photo", editFile);
            await apiClient.patch(`/api/v1/brands/${editing}`, fd);
            queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
            setEditing(null);
        } catch (e: unknown) {
            setError(parseError(e));
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError("");
        try {
            await apiClient.delete(`/api/v1/brands/${deleteTarget}`);
            queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
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

            <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search brands..."
                className="w-full max-w-sm h-10 px-3 border border-gray-300 rounded-lg text-sm mb-4"
            />

            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Image</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paged.map((b: Brand) => (
                            <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                {editing === b._id ? (
                                    <>
                                        <td className="px-4 py-3">
                                            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 px-2 border border-gray-300 rounded text-sm w-full" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files?.[0] ?? null)} className="text-xs" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={saveEdit} className="h-8 px-3 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer">Save</button>
                                                <button type="button" onClick={() => setEditing(null)} className="h-8 px-3 rounded-md border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                                        <td className="px-4 py-3">
                                            {b.photo ? (
                                                <div className="w-10 h-10 relative rounded-md overflow-hidden border border-gray-200">
                                                    <Image src={b.photo} alt={b.name} fill className="object-cover" />
                                                </div>
                                            ) : <span className="text-xs text-gray-400">--</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => handleEdit(b)} className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer">Edit</button>
                                                <button type="button" onClick={() => setDeleteTarget(b._id)} className="h-8 px-3 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer">Delete</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paged.length === 0 && <p className="text-center text-sm text-gray-400 py-10">No brands found</p>}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <ConfirmDialog open={!!deleteTarget} title="Delete brand?" message="This cannot be undone." confirmLabel="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </div>
    );
}
