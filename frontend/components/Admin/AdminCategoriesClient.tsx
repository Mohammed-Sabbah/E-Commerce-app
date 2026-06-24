"use client";

import { useState, useMemo, useRef } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import type { Category } from "@/types/api";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
    initial: Category[];
}

const PAGE_SIZE = 15;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
                <div className="flex items-center gap-1">
                    <div className="w-6 h-6 relative rounded overflow-hidden border border-gray-200">
                        <Image src={current.startsWith("http") ? current : `${API_URL}/${current}`} alt="" fill className="object-cover" />
                    </div>
                    <span className="text-xs text-gray-500">{current.split("/").pop()}</span>
                </div>
            ) : (
                <span className="text-xs text-gray-400">No file chosen</span>
            )}
            {(file || current) && (
                <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:text-red-700 underline cursor-pointer">Remove</button>
            )}
        </div>
    );
}

export default function AdminCategoriesClient({ initial }: Props) {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editFile, setEditFile] = useState<File | null>(null);
    const [creating, setCreating] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createFile, setCreateFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const { data: items = initial } = useQuery({
        queryKey: ["admin", "categories"],
        queryFn: async () => {
            const res = await apiClient.get("/api/v1/categories?limit=1000&sort=-createdAt");
            return res.data?.data?.docs ?? [];
        },
        initialData: initial,
        staleTime: 30000,
    });

    const filtered = useMemo(() => {
        if (!search.trim()) return items;
        return items.filter((c: Category) => c.name.toLowerCase().includes(search.toLowerCase()));
    }, [items, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const activeCategory = editing ? items.find((c: Category) => c._id === editing) : null;

    const handleEdit = (c: Category) => {
        setEditing(c._id);
        setEditName(c.name);
        setEditFile(null);
        setCreating(false);
    };

    const saveEdit = async () => {
        if (!editing || !editName.trim()) return;
        setError("");
        try {
            const fd = new FormData();
            fd.append("name", editName.trim());
            if (editFile) fd.append("photo", editFile);
            await apiClient.patch(`/api/v1/categories/${editing}`, fd);
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            setEditing(null);
        } catch (e: unknown) {
            setError(parseError(e));
        }
    };

    const handleCreate = async () => {
        if (!createName.trim()) return;
        setError("");
        try {
            const fd = new FormData();
            fd.append("name", createName.trim());
            if (createFile) fd.append("photo", createFile);
            await apiClient.post("/api/v1/categories", fd);
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            setCreating(false);
            setCreateName("");
            setCreateFile(null);
        } catch (e: unknown) {
            setError(parseError(e));
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError("");
        try {
            await apiClient.delete(`/api/v1/categories/${deleteTarget}`);
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
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

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search categories..."
                    className="flex-1 min-w-[200px] h-10 px-3 border border-gray-300 rounded-lg text-sm"
                />
                <button
                    type="button"
                    onClick={() => { setCreating(true); setEditing(null); setCreateName(""); setCreateFile(null); }}
                    className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    + New Category
                </button>
            </div>

            {creating && (
                <div className="border border-gray-200 rounded-xl bg-white p-5 mb-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Name</label>
                            <input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Category name" className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-48" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Photo</label>
                            <FileInput file={createFile} onChange={setCreateFile} onRemove={() => setCreateFile(null)} />
                        </div>
                        <button type="button" onClick={handleCreate} disabled={!createName.trim()} className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer">Create</button>
                        <button type="button" onClick={() => setCreating(false)} className="h-10 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                    </div>
                </div>
            )}

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
                        {paged.map((c: Category) => (
                            <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                {editing === c._id ? (
                                    <>
                                        <td className="px-4 py-3">
                                            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 px-2 border border-gray-300 rounded text-sm w-full" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <FileInput
                                                current={activeCategory?.photo}
                                                file={editFile}
                                                onChange={setEditFile}
                                                onRemove={() => setEditFile(null)}
                                            />
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
                                        <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                        <td className="px-4 py-3">
                                            {c.photo ? (
                                                <div className="w-10 h-10 relative rounded-md overflow-hidden border border-gray-200">
                                                    <Image src={c.photo.startsWith("http") ? c.photo : `${API_URL}/${c.photo}`} alt={c.name} fill className="object-cover" />
                                                </div>
                                            ) : <span className="text-xs text-gray-400">--</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => handleEdit(c)} className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer">Edit</button>
                                                <button type="button" onClick={() => setDeleteTarget(c._id)} className="h-8 px-3 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer">Delete</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paged.length === 0 && <p className="text-center text-sm text-gray-400 py-10">No categories found</p>}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <ConfirmDialog open={!!deleteTarget} title="Delete category?" message="This cannot be undone." confirmLabel="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </div>
    );
}
