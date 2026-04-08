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
import LogoutButton from "../StyledButton/LogoutButton";

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
        <div className="relative flex items-center" ref={menuRef}>
            {/* زر اليوزر */}
            <button
                onClick={() => setOpen(!open)}
                className={`rounded-full transition p-1 ${open ? "bg-[#DB4444] text-white" : " text-black"
                    }`}
            >
                <UserIcon className="h-6 w-6 transition-transform duration-200 hover:scale-120" />
            </button>


            {/* القائمة */}
            {open && (
                <div className="absolute right-0 mt-3 w-56 top-full rounded-[5px] p-3
                bg-black/40 backdrop-blur-xl border border-white/20
                shadow-2xl text-white z-10">

                    <ul className="space-y-3 text-sm">

                        <li className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer
    text-white/75 hover:text-white hover:bg-white/[0.08] transition-all text-sm">                            <Cog6ToothIcon className="w-5 h-5" />
                            Manage My Account
                        </li>

                        <li className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer
    text-white/75 hover:text-white hover:bg-white/[0.08] transition-all text-sm">                            <ShoppingBagIcon className="w-5 h-5" />
                            My Order
                        </li>

                        <li className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer
    text-white/75 hover:text-white hover:bg-white/[0.08] transition-all text-sm">                            <XCircleIcon className="w-5 h-5" />
                            My Cancellations
                        </li>

                        <li className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer
    text-white/75 hover:text-white hover:bg-white/[0.08] transition-all text-sm">                            <StarIcon className="w-5 h-5" />
                            My Reviews
                        </li>

                        <li className="border-t border-white/20 pt-2 mt-2">
                            <LogoutButton className="flex items-center cursor-pointer gap-2 w-full text-left px-2.5 py-2 rounded-md
    text-white/75 hover:text-[rgb(250,40,40)] hover:bg-[#DB4444]/20 transition-all text-sm">
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                Logout
                            </LogoutButton>
                        </li>

                    </ul>
                </div>
            )}
        </div>
    );
}

export default UserMenu;