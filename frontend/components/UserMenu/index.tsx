"use client";

import { useState, useRef, useEffect } from "react";
import {
    UserIcon,
    ShoppingBagIcon,
    XCircleIcon,
    StarIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";

function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {/* زر اليوزر */}
            <button
                onClick={() => setOpen(!open)}
                className={`rounded-full p-2 transition ${
                    open ? "bg-orange-500 text-white" : "bg-red-500 text-white"
                }`}
            >
                <UserIcon className="h-5 w-5" />
            </button>

            {/* القائمة */}
            {open && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl p-3
                bg-black/25 backdrop-blur-xl border border-white/20
                shadow-2xl text-white">

                    <ul className="space-y-3 text-sm">

                        <li className="flex items-center gap-2 cursor-pointer hover:text-[#DB4444] transition">
                            <Cog6ToothIcon className="w-5 h-5" />
                            Manage My Account
                        </li>

                        <li className="flex items-center gap-2 cursor-pointer hover:text-[#DB4444] transition">
                            <ShoppingBagIcon className="w-5 h-5" />
                            My Order
                        </li>

                        <li className="flex items-center gap-2 cursor-pointer hover:text-[#DB4444] transition">
                            <XCircleIcon className="w-5 h-5" />
                            My Cancellations
                        </li>

                        <li className="flex items-center gap-2 cursor-pointer hover:text-[#DB4444] transition">
                            <StarIcon className="w-5 h-5" />
                            My Reviews
                        </li>

                        <li className="border-t border-white/20 pt-2 mt-2">
                            <button className="flex items-center gap-2 w-full text-left hover:text-[#DB4444] transition">
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                Logout
                            </button>
                        </li>

                    </ul>
                </div>
            )}
        </div>
    );
}

export default UserMenu;