"use client";

import { useState, useMemo } from "react";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminUser } from "@/types/admin";
import { UserCheck, UserX, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
    initial: AdminUser[];
}

const PAGE_SIZE = 15;

export default function AdminUsersClient({ initial }: Props) {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState<{ id: string; action: "toggle" | "delete" } | null>(null);

    const { data: users = initial } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: async () => {
            const res = await apiClient.get("/api/v1/users?limit=1000&sort=-createdAt");
            return res.data?.data?.docs ?? [];
        },
        initialData: initial,
        staleTime: 30000,
    });

    const filtered = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter((u: AdminUser) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [users, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const doAction = async () => {
        if (!confirm) return;
        setActionId(confirm.id);
        setError("");
        try {
            const user = users.find((u: AdminUser) => u._id === confirm.id);
            if (confirm.action === "toggle") {
                const endpoint = user?.isActive
                    ? `/api/v1/users/${confirm.id}/deactivate`
                    : `/api/v1/users/${confirm.id}/activate`;
                await apiClient.patch(endpoint);
            } else {
                await apiClient.delete(`/api/v1/users/${confirm.id}`);
            }
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        } catch (e: unknown) {
            setError(parseError(e));
        } finally {
            setActionId(null);
            setConfirm(null);
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
                placeholder="Search users by name or email..."
                className="w-full max-w-sm h-10 px-3 border border-gray-300 rounded-lg text-sm mb-4"
            />

            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paged.map((u: AdminUser) => (
                            <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                <td className="px-4 py-3 capitalize">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                        u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                                    }`}>{u.role}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                        u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}>
                                        {u.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                                        {u.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {u.role !== "admin" && (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={actionId === u._id}
                                                    onClick={() => setConfirm({ id: u._id, action: "toggle" })}
                                                    className="h-8 px-3 rounded-md border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer"
                                                >
                                                    {actionId === u._id ? "..." : u.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={actionId === u._id}
                                                    onClick={() => setConfirm({ id: u._id, action: "delete" })}
                                                    className="h-8 w-8 rounded-md border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer"
                                                    aria-label="Delete user"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                        {u.role === "admin" && <span className="text-xs text-gray-400">--</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paged.length === 0 && <p className="text-center text-sm text-gray-400 py-10">No users found</p>}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <ConfirmDialog
                open={!!confirm}
                title={confirm?.action === "delete" ? "Delete user?" : "Toggle user status?"}
                message={confirm?.action === "delete" ? "This cannot be undone." : "Are you sure?"}
                confirmLabel={confirm?.action === "delete" ? "Delete" : "Confirm"}
                danger={confirm?.action === "delete"}
                onConfirm={doAction}
                onCancel={() => setConfirm(null)}
            />
        </div>
    );
}
