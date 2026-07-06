"use client";

import { useState, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import type { Category } from "@/types/api";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
    initial: Category[];
}

const PAGE_SIZE = 15;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function FileInput({ current, file, onChange, onRemove, onRemoveCurrent, t }: {
    current?: string;
    file: File | null;
    onChange: (f: File | null) => void;
    onRemove: () => void;
    onRemoveCurrent?: () => void;
    t: (key: string) => string;
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
                {t('chooseImage')}
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
                <span className="text-xs text-gray-400">{t('noFileChosen')}</span>
            )}
            {(file || current) && (
                <button type="button" onClick={handleRemove} className="text-xs text-red-500 hover:text-red-700 underline cursor-pointer">
                    {t('imageRemove')}
                </button>
            )}
        </div>
    );
}

export default function AdminCategoriesClient({ initial }: Props) {
    const t = useTranslations('admin');
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editFile, setEditFile] = useState<File | null>(null);
    const [editCurrentPhoto, setEditCurrentPhoto] = useState<string | undefined>(undefined);
    const [creating, setCreating] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createFile, setCreateFile] = useState<File | null>(null);
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
        setEditCurrentPhoto(c.photo);
        setCreating(false);
    };

    const saveEditMutation = useMutation({
        mutationFn: async () => {
            if (!editing || !editName.trim()) return;
            const fd = new FormData();
            fd.append("name", editName.trim());
            if (editFile) fd.append("photo", editFile);
            else if (!editCurrentPhoto) fd.append("photo", "");
            await apiClient.patch(`/api/v1/categories/${editing}`, fd);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            setEditing(null);
                    toast.success(t("categorySaved"));
        },
        onError: (e: unknown) => toast.error(parseError(e)),
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            if (!createName.trim()) return;
            const fd = new FormData();
            fd.append("name", createName.trim());
            if (createFile) fd.append("photo", createFile);
            await apiClient.post("/api/v1/categories", fd);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            setCreating(false);
            setCreateName("");
            setCreateFile(null);
            toast.success(t("categorySaved"));
        },
        onError: (e: unknown) => toast.error(parseError(e)),
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!deleteTarget) return;
            await apiClient.delete(`/api/v1/categories/${deleteTarget}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            setDeleteTarget(null);
            toast.success(t("categoryDeleted"));
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
                    placeholder={t('searchPlaceholder')}
                    className="flex-1 min-w-[200px] h-10 px-3 border border-gray-300 rounded-lg text-sm"
                />
                <button
                    type="button"
                    onClick={() => { setCreating(true); setEditing(null); setCreateName(""); setCreateFile(null); }}
                    className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    + {t('addCategory')}
                </button>
            </div>

            {creating && (
                <div className="border border-gray-200 rounded-xl bg-white p-5 mb-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">{t('categoryName')}</label>
                            <input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder={t('categoryName')} className="h-10 px-3 border border-gray-300 rounded-lg text-sm w-48" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">{t('categoryPhoto')}</label>
                            <FileInput t={t} file={createFile} onChange={setCreateFile} onRemove={() => setCreateFile(null)} />
                        </div>
                        <button type="button" onClick={() => createMutation.mutate()} disabled={!createName.trim() || createMutation.isPending} className="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer">{createMutation.isPending ? t('creating') : t('create')}</button>
                        <button type="button" onClick={() => setCreating(false)} className="h-10 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">{t('cancel')}</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-start text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">{t('categoryName')}</th>
                            <th className="px-4 py-3 font-medium">{t('image')}</th>
                            <th className="px-4 py-3 font-medium">{t('actions')}</th>
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
                                                t={t}
                                                current={editCurrentPhoto}
                                                file={editFile}
                                                onChange={setEditFile}
                                                onRemove={() => setEditFile(null)}
                                                onRemoveCurrent={() => setEditCurrentPhoto(undefined)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => saveEditMutation.mutate()} disabled={saveEditMutation.isPending} className="h-8 px-3 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors cursor-pointer">{saveEditMutation.isPending ? t('saving') : t('save')}</button>
                                                <button type="button" onClick={() => setEditing(null)} className="h-8 px-3 rounded-md border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">{t('cancel')}</button>
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
                                                <button type="button" onClick={() => handleEdit(c)} className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer">{t('edit')}</button>
                                                <button type="button" onClick={() => setDeleteTarget(c._id)} className="h-8 px-3 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer">{t('delete')}</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paged.length === 0 && <p className="text-center text-sm text-gray-400 py-10">{t('noCategories')}</p>}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <ConfirmDialog open={!!deleteTarget} title={t('confirmDeleteTitle')} message={t('confirmDeleteMessage')} confirmLabel={t('yesDelete')} danger onConfirm={() => deleteMutation.mutate()} onCancel={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
        </div>
    );
}
