"use client";

import { useState, useRef, useEffect } from "react";
import { AdjustmentsHorizontalIcon, ChevronDownIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const SORT_OPTIONS = [
    { label: "Newest", value: "-createdAt" },
    { label: "Oldest", value: "createdAt" },
    { label: "Price: Low to High", value: "price" },
    { label: "Price: High to Low", value: "-price" },
    { label: "Best Selling", value: "-sold" },
    { label: "Top Rated", value: "-avgRatings" },
];

interface ProductsTopBarProps {
    total: number;
    keyword: string;
    activeSort: string;
    priceMin: string;
    priceMax: string;
    onSortChange: (sort: string) => void;
    onPriceChange: (min: string, max: string) => void;
    onPriceMinChange: (value: string) => void;
    onPriceMaxChange: (value: string) => void;
    onOpenFilters: () => void;
}

export default function ProductsTopBar({
    total,
    keyword,
    activeSort,
    priceMin,
    priceMax,
    onSortChange,
    onPriceChange,
    onPriceMinChange,
    onPriceMaxChange,
    onOpenFilters,
}: ProductsTopBarProps) {
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const activeSortLabel =
        SORT_OPTIONS.find((o) => o.value === activeSort)?.label ?? "Newest";

    // إغلاق الـ dropdown لما يضغط خارجه
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Title + Count */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">
                    {keyword ? `Results for "${keyword}"` : "All Products"}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">{total} products found</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">

                {/* Price Range */}
                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 bg-white">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => onPriceMinChange(e.target.value)}
                        className="w-16 text-sm text-gray-700 outline-none placeholder-gray-300"
                    />
                    <span className="text-gray-300">–</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => onPriceMaxChange(e.target.value)}
                        className="w-16 text-sm text-gray-700 outline-none placeholder-gray-300"
                    />
                    <button
                        onClick={() => onPriceChange(priceMin, priceMax)}
                        className="ml-1 text-xs font-medium text-white bg-gray-900 px-2.5 py-1 rounded-md hover:bg-gray-700 transition"
                    >
                        Go
                    </button>
                </div>

                {/* Custom Sort Dropdown */}
                <div ref={sortRef} className="relative">
                    <button
                        onClick={() => setSortOpen((prev) => !prev)}
                        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 transition min-w-[140px] justify-between"
                    >
                        <span>{activeSortLabel}</span>
                        <ChevronDownIcon
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {sortOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onSortChange(opt.value);
                                        setSortOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                        ${activeSort === opt.value
                                            ? "text-[#DB4444] font-medium bg-red-50"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Filters Button */}
                <button
                    onClick={onOpenFilters}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                    <Squares2X2Icon className="w-4 h-4" />
                    Categories
                </button>
            </div>
        </div>
    );
}