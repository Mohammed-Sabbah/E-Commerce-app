"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [keyword, setKeyword] = useState(() => searchParams.get('keyword') ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!keyword.trim()) {
            router.push('/products'); // ← مسح الكلمة = رجوع لكل المنتجات
            return;
        }
        router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-2 w-48 lg:w-64">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setKeyword('')}
                placeholder="What are you looking for?"
                className="bg-transparent text-sm outline-none flex-1"
            />
            <button type="submit" className="text-gray-400 hover:text-gray-700 transition">
                <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
        </form>
    );
}

export default SearchInput;