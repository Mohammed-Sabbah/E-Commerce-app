"use client";

import { useTranslations } from 'next-intl';
import { useState, useTransition, useOptimistic } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import ProductsTopBar from "./ProductsTopBar";
import ActiveFilterTags from "./ActiveFilterTags";
import type { Product, Category } from "@/types/api";
import { fetchProducts } from "@/services/client/productService";

interface Props {
    initialProducts: Product[];
    categories: Category[];
    total: number;
    initialParams: { [key: string]: string | undefined };
}

export default function ProductsClient({
    initialProducts,
    categories,
    total,
    initialParams,
}: Props) {
    const t = useTranslations('products');
    const tc = useTranslations('common');
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // ── Load More state ──
    const [extraProducts, setExtraProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    // ── Mobile drawer state ──
    const [drawerOpen, setDrawerOpen] = useState(false);

    // ── Active params من السيرفر ──
    const activeCategory = initialParams.category ?? "";
    const activeSort = initialParams.sort ?? "-createdAt";
    const activeKeyword = initialParams.keyword ?? "";
    const activePriceMin = initialParams.priceMin ?? "";
    const activePriceMax = initialParams.priceMax ?? "";
    const activeDiscount = initialParams.discount ?? "";

    // ── Local price state (input) ──
    const [priceMin, setPriceMin] = useState(activePriceMin);
    const [priceMax, setPriceMax] = useState(activePriceMax);

    // ── useOptimistic للـ category ──
    // بيغير الـ UI فوراً قبل ما يرجع السيرفر
    const [optimisticCategory, setOptimisticCategory] = useOptimistic(activeCategory);

    // ── Products المدمجة ──
    const existingIds = new Set(initialProducts.map((p) => p._id));
    const allProducts = [
        ...initialProducts,
        ...extraProducts.filter((p) => !existingIds.has(p._id)),
    ];
    const hasMore = allProducts.length < total;

    // ── اسم الـ category النشطة للـ tags ──
    const activeCategoryName =
        categories.find((c) => c._id === optimisticCategory)?.name ?? "";

    // ── بناء الـ URL ──
    function buildUrl(overrides: Record<string, string>) {
        const params = new URLSearchParams();
        const merged = {
            ...(activeCategory && { category: activeCategory }),
            ...(activeSort && { sort: activeSort }),
            ...(activeKeyword && { keyword: activeKeyword }),
            ...(activePriceMin && { priceMin: activePriceMin }),
            ...(activePriceMax && { priceMax: activePriceMax }),
            ...(activeDiscount && { discount: activeDiscount }),
            ...overrides,
        };
        Object.entries(merged).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        return `${pathname}?${params.toString()}`;
    }

    // ── Navigation مع reset للـ extra products ──
    function navigate(overrides: Record<string, string>) {
        setExtraProducts([]);
        setPage(1);
        startTransition(() => {
            router.push(buildUrl(overrides));
            router.refresh();
        });
    }
    function handleRemoveDiscount() {
        navigate({ discount: "" });
    }

    // ── Handlers ──
    function handleCategoryChange(categoryId: string) {
        startTransition(() => {
            setOptimisticCategory(categoryId); // ← جوا startTransition
            router.push(buildUrl({ category: categoryId }));
            router.refresh();
        });
    }

    function handleSortChange(sort: string) {
        navigate({ sort });
    }

    function handlePriceApply(min: string, max: string) {
        navigate({ priceMin: min, priceMax: max });
    }

    function handleRemoveCategory() {
        setOptimisticCategory("");
        navigate({ category: "" });
    }

    function handleRemovePrice() {
        setPriceMin("");
        setPriceMax("");
        navigate({ priceMin: "", priceMax: "" });
    }

    function handleClearAll() {
        setOptimisticCategory("");
        setPriceMin("");
        setPriceMax("");
        navigate({ category: "", priceMin: "", priceMax: "", discount: "" });
    }

    // ── Load More ──
    async function loadMore() {
        const nextPage = page + 1;
        setLoadingMore(true);
        try {
            const data = await fetchProducts({
                page: nextPage,
                limit: 12,
                sort: activeSort,
                ...(activeCategory && { category: activeCategory }),
                ...(activeKeyword && { keyword: activeKeyword }),
                ...(activePriceMin && { "price[gte]": activePriceMin }),
                ...(activePriceMax && { "price[lte]": activePriceMax }),
            });
            const newProducts = data?.data?.docs ?? [];
            setExtraProducts((prev) => [...prev, ...newProducts]);
            setPage(nextPage);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMore(false);
        }
    }

    // ── Sidebar props مشتركة ──
    const sidebarProps = {
        categories,
        activeCategory: optimisticCategory,
        onCategoryChange: handleCategoryChange,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* Mobile Drawer */}
            <MobileFilterDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                {...sidebarProps}
            />

            {/* Top Bar */}
            <div className="mb-6 space-y-3">
                <ProductsTopBar
                    total={total}
                    keyword={activeKeyword}
                    activeSort={activeSort}
                    priceMin={priceMin}
                    priceMax={priceMax}
                    onSortChange={handleSortChange}
                    onPriceChange={handlePriceApply}
                    onPriceMinChange={setPriceMin}
                    onPriceMaxChange={setPriceMax}
                    onOpenFilters={() => setDrawerOpen(true)}
                />
                <ActiveFilterTags
                    activeCategory={optimisticCategory}
                    categoryName={activeCategoryName}
                    priceMin={activePriceMin}
                    priceMax={activePriceMax}
                    activeDiscount={activeDiscount}
                    onRemoveCategory={handleRemoveCategory}
                    onRemovePrice={handleRemovePrice}
                    onRemoveDiscount={handleRemoveDiscount}
                    onClearAll={handleClearAll}
                />
            </div>

            <div className="flex gap-8">

                {/* Desktop Sidebar */}
                <FilterSidebar {...sidebarProps} />

                {/* Products */}
                <div className="flex-1 min-w-0">
                    {isPending ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-72 bg-gray-100 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : allProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                            <p className="text-lg font-medium">{t('noProductsFound')}</p>
                            <p className="text-sm mt-1">{t('noProductsMatch')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                            {allProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {hasMore && !isPending && (
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="bg-[#DB4444] text-white px-12 py-3 rounded-lg hover:bg-red-600 transition disabled:opacity-60 font-medium"
                            >
                                {loadingMore ? tc('loading') : t('loadMore')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}