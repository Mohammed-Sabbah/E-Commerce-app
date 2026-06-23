"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Grid3X3,
    Tag,
    Ticket,
    Users,
    LogOut,
    Store,
    Menu,
    X,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const NAV_ITEMS = [
    { label: "Overview",    href: "/admin",            icon: LayoutDashboard },
    { label: "Orders",      href: "/admin/orders",     icon: ShoppingCart },
    { label: "Products",    href: "/admin/products",   icon: Package },
    { label: "Categories",  href: "/admin/categories", icon: Grid3X3 },
    { label: "Brands",      href: "/admin/brands",     icon: Tag },
    { label: "Coupons",     href: "/admin/coupons",    icon: Ticket },
    { label: "Users",       href: "/admin/users",      icon: Users },
];

interface Props {
    user: { name: string; email: string };
}

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    async function handleLogout() {
        try {
            await apiClient.post("/api/v1/auth/logout");
        } catch { /* ignore */ }
        router.push("/login");
        router.refresh();
    }

    const nav = (
        <>
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2 text-[#DB4444] font-semibold text-lg">
                    <Store size={20} />
                    <span>Exclusive</span>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const isActive = href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-[#DB4444]/10 text-[#DB4444]"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            <Icon size={17} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div className="px-4 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3 px-1">
                    <div className="w-8 h-8 rounded-full bg-[#DB4444]/15 text-[#DB4444] flex items-center justify-center text-sm font-semibold">
                        {user.name?.[0]?.toUpperCase() ?? "A"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                    <LogOut size={15} />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="fixed top-3 left-3 z-50 md:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-sm cursor-pointer"
                aria-label="Toggle sidebar"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-gray-200 flex-col h-screen sticky top-0">
                {nav}
            </aside>

            {/* Mobile overlay */}
            {open && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
                    <aside className="relative w-64 bg-white h-full shadow-xl flex flex-col">
                        {nav}
                    </aside>
                </div>
            )}
        </>
    );
}
