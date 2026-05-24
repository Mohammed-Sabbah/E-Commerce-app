"use client";
// frontend/components/Account/AccountSidebar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    BookMarked,
    ShoppingBag,
    Star,
    Heart,
} from "lucide-react";

const navItems = [
    { label: "My Profile", href: "/account", icon: User },
    { label: "Address Book", href: "/account/address", icon: BookMarked },
    { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
    { label: "My Reviews", href: "/account/reviews", icon: Star },
    { label: "My WishList", href: "/wishlist", icon: Heart },
];

export default function AccountSidebar() {
    const pathname = usePathname();

    function isActive(href: string) {
        return pathname === href;
    }

    return (
        <aside className="w-full lg:w-[220px] shrink-0">
            <nav>
                <ul className="space-y-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                                        ${active
                                            ? "bg-[#DB4444]/8 text-[#DB4444] font-medium"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        }`}
                                >
                                    <Icon
                                        size={17}
                                        className={active ? "text-[#DB4444]" : "text-gray-400"}
                                        strokeWidth={active ? 2.2 : 1.8}
                                    />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}