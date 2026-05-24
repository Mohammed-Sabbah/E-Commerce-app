"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Category } from "@/types/api";

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

export default function MobileFilterDrawer({
    isOpen,
    onClose,
    categories,
    activeCategory,
    onCategoryChange,
}: MobileFilterDrawerProps) {

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden shadow-xl
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                        aria-label="Close filters"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex-1 overflow-y-auto px-5 py-5">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                        Category
                    </h3>
                    <ul className="space-y-0.5">
                        <li>
                            <button
                                onClick={() => { onCategoryChange(""); onClose(); }}
                                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                                    ${!activeCategory ? "bg-[#DB4444] text-white font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                                All
                            </button>
                        </li>
                        {categories.map((cat) => (
                            <li key={cat._id}>
                                <button
                                    onClick={() => { onCategoryChange(cat._id); onClose(); }}
                                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                                        ${activeCategory === cat._id ? "bg-[#DB4444] text-white font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}