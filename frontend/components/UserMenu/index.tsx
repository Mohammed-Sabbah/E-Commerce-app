"use client";
// frontend/components/UserMenu/index.tsx

import { useState, useRef, useEffect } from "react";
import {
    UserIcon,
    ShoppingBagIcon,
    XCircleIcon,
    StarIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import LogoutButton from "../StyledButton/LogoutButton";
import Link from "next/link";

const menuItems = [
    { href: "/account", icon: Cog6ToothIcon, label: "Manage My Account" },
    { href: "/account/orders", icon: ShoppingBagIcon, label: "My Order" },
    { href: "/account/orders?filter=cancelled", icon: XCircleIcon, label: "My Cancellations" },
    { href: "/account/reviews", icon: StarIcon, label: "My Reviews" },   // ← صُحِّح
];

function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    return (
        <div className="relative flex items-center" ref={menuRef}>
            {/* زر اليوزر */}
            <button
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
                className={`rounded-full transition-all duration-200 p-1 cursor-pointer
                    ${open ? "bg-[#DB4444] text-white" : "text-black"}`}
            >
                <UserIcon className="h-6 w-6" />
            </button>

            {/* القائمة */}
            <div className={`absolute right-0 top-full mt-3 w-56 rounded-[5px] p-3
                bg-black/40 backdrop-blur-xl border border-white/20
                shadow-2xl text-white z-50
                transition-all duration-200 origin-top-right
                ${open
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
                <ul className="space-y-1 text-sm">
                    {menuItems.map(({ href, icon: Icon, label }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-md
                                    text-white/75 hover:text-white hover:bg-white/[0.08]
                                    transition-all duration-150"
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {label}
                            </Link>
                        </li>
                    ))}

                    <li className="border-t border-white/20 pt-1 mt-1">
                        <LogoutButton
                            className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-md
                                text-white/75 hover:text-[rgb(250,40,40)] hover:bg-[#DB4444]/20
                                transition-all duration-150 text-sm cursor-pointer"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
                            Logout
                        </LogoutButton>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default UserMenu;