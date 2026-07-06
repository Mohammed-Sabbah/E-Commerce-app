"use client";

import type { Category } from "@/types/api";

interface FilterSidebarProps {
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export default function FilterSidebar({
    categories,
    activeCategory,
    onCategoryChange,
}: FilterSidebarProps) {
    return (
        <aside className="w-full lg:w-56 shrink-0 hidden lg:flex flex-col gap-3 sticky top-30 self-start">

            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Category
            </h3>

            <ul className="space-y-0.5 max-h-[calc(100vh-12rem)] overflow-y-auto pe-1">
                <li>
                    <button
                        onClick={() => onCategoryChange("")}
                        className={`w-full text-start text-sm px-3 py-2 rounded-lg transition-colors duration-150
                            ${!activeCategory
                                ? "bg-[#DB4444] text-white font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        All
                    </button>
                </li>
                {categories.map((cat) => (
                    <li key={cat._id}>
                        <button
                            onClick={() => onCategoryChange(cat._id)}
                            className={`w-full text-start text-sm px-3 py-2 rounded-lg transition-colors duration-150
                                ${activeCategory === cat._id
                                    ? "bg-[#DB4444] text-white font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {cat.name}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}