"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
    User,
    BookMarked,
    ShoppingBag,
    Star,
    Heart,
} from "lucide-react";

const navItems = [
    { key: "myProfile", href: "/account", icon: User },
    { key: "myAddressBook", href: "/account/address", icon: BookMarked },
    { key: "myOrders", href: "/account/orders", icon: ShoppingBag },
    { key: "myReviews", href: "/account/reviews", icon: Star },
    { key: "myWishlist", href: "/wishlist", icon: Heart },
];

export default function AccountSidebar() {
    const t = useTranslations("account");
    const pathname = usePathname();

    function isActive(href: string) {
        return pathname === href;
    }

    return (
        <aside className="w-full lg:w-[220px] shrink-0">
            <nav>
                <ul className="space-y-1">
                    {navItems.map(({ key, href, icon: Icon }) => {
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
                                    {t(key)}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}