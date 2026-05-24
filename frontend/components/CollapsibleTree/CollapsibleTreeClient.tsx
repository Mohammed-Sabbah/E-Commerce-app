"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import type { Category } from "@/types/api";

interface Props {
    categories: Category[];
    className?: string;
}

type GroupedCategories = {
    grouped: Record<string, Category[]>;
    ungrouped: Category[];
};

const SLUG_TO_GROUP: Record<string, string> = {
    "smartphones": "Electronics",
    "laptops": "Electronics",
    "tablets": "Electronics",
    "mobile-accessories": "Electronics",
    "mens-shirts": "Men",
    "mens-shoes": "Men",
    "mens-watches": "Men",
    "womens-bags": "Women",
    "womens-dresses": "Women",
    "womens-jewellery": "Women",
    "womens-shoes": "Women",
    "womens-watches": "Women",
    "tops-for-women": "Women",
    "beauty": "Beauty",
    "fragrances": "Beauty",
    "skin-care": "Beauty",
    "home-decoration": "Home",
    "furniture": "Home",
    "kitchen-accessories": "Home",
    "groceries": "Groceries",
    "sports-accessories": "Sports",
    "sunglasses": "Accessories",
    "vehicle": "Vehicles",
    "motorcycle": "Vehicles",
};

const GROUP_ORDER = [
    "Electronics", "Men", "Women", "Beauty",
    "Home", "Groceries", "Sports", "Accessories", "Vehicles",
];

function groupCategories(categories: Category[]): GroupedCategories {
    const grouped: Record<string, Category[]> = {};
    const ungrouped: Category[] = [];

    for (const cat of categories) {
        const group = SLUG_TO_GROUP[cat.slug];
        if (group) {
            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(cat);
        } else {
            ungrouped.push(cat);
        }
    }

    return { grouped, ungrouped };
}

export function CollapsibleTreeClient({ categories, className }: Props) {
    const router = useRouter();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const { grouped, ungrouped } = groupCategories(categories);

    const orderedGroups = [
        ...GROUP_ORDER.filter((g) => grouped[g]),
        ...Object.keys(grouped).filter((g) => !GROUP_ORDER.includes(g)),
    ];

    const toggleGroup = useCallback((group: string) => {
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    }, []);

    const handleCategoryClick = useCallback(
        (id: string) => {
            router.push(`/products?category=${id}`);
        },
        [router]
    );

    return (
        <nav
            aria-label="Categories"
            className={`flex flex-col gap-4 ${className ?? ""}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
        >
            {orderedGroups.map((group) => {
                const isOpen = openGroups[group] ?? false;
                const items = grouped[group];

                return (
                    <Collapsible
                        key={group}
                        open={isOpen}
                        onOpenChange={() => toggleGroup(group)}
                    >
                        <CollapsibleTrigger asChild>
                            <button className="flex w-full items-center justify-between gap-2 text-left outline-none transition-opacity duration-150 hover:opacity-60">
                                <span style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, color: "#000000" }}>
                                    {group}
                                </span>
                                <ChevronDownIcon
                                    className="h-4 w-4 shrink-0 transition-transform duration-200"
                                    style={{ color: "#000000", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
                                />
                            </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <div className="mt-3 flex flex-col gap-3 border-l-2 border-black/15 pl-4">
                                {items.map((cat) => (
                                    <button
                                        key={cat._id}
                                        className="w-full text-left outline-none opacity-75 transition-opacity duration-150 hover:opacity-100"
                                        style={{ fontSize: "14px", lineHeight: "24px", fontWeight: 400, color: "#000000" }}
                                        onClick={() => handleCategoryClick(cat._id)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                );
            })}

            {ungrouped.map((cat) => (
                <button
                    key={cat._id}
                    className="w-full text-left outline-none transition-opacity duration-150 hover:opacity-60"
                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, color: "#000000" }}
                    onClick={() => handleCategoryClick(cat._id)}
                >
                    {cat.name}
                </button>
            ))}
        </nav>
    );
}