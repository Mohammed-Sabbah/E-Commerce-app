"use client";

import { useTranslations } from 'next-intl';
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ActiveFilterTagsProps {
    activeCategory: string;
    categoryName: string;
    priceMin: string;
    priceMax: string;
    activeDiscount: string;        // ← أضف
    onRemoveCategory: () => void;
    onRemovePrice: () => void;
    onRemoveDiscount: () => void;  // ← أضف
    onClearAll: () => void;
}

export default function ActiveFilterTags({
    activeCategory,
    categoryName,
    priceMin,
    priceMax,
    activeDiscount,        // ← أضف
    onRemoveCategory,
    onRemovePrice,
    onRemoveDiscount,      // ← أضف
    onClearAll,
}: ActiveFilterTagsProps) {
    const t = useTranslations('products');

    const hasFilters = activeCategory || priceMin || priceMax || activeDiscount;
    if (!hasFilters) return null;

    const filterCount = [activeCategory, priceMin || priceMax, activeDiscount].filter(Boolean).length;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium">{t('activeFilters')}</span>

            {/* Discount tag */}
            {activeDiscount && (
                <button
                    onClick={onRemoveDiscount}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition"
                >
                    {t('flashSales')}
                    <XMarkIcon className="w-3 h-3" />
                </button>
            )}

            {/* Category tag */}
            {activeCategory && (
                <button
                    onClick={onRemoveCategory}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition"
                >
                    {categoryName}
                    <XMarkIcon className="w-3 h-3" />
                </button>
            )}

            {/* Price tag */}
            {(priceMin || priceMax) && (
                <button
                    onClick={onRemovePrice}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition"
                >
                    {priceMin && priceMax
                        ? `$${priceMin} – $${priceMax}`
                        : priceMin
                            ? `From $${priceMin}`
                            : `Up to $${priceMax}`}
                    <XMarkIcon className="w-3 h-3" />
                </button>
            )}

            {/* Clear all - يظهر لو في أكثر من فلتر */}
            {filterCount > 1 && (
                <button
                    onClick={onClearAll}
                    className="text-xs text-[#DB4444] hover:underline ms-1 transition"
                >
                    {t('clearAll')}
                </button>
            )}
        </div>
    );
}