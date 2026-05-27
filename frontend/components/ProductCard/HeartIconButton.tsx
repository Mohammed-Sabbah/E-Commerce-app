'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import LoadingSvg from '../LoadingSvg';
import Cookies from 'js-cookie';
import { useHasMounted } from '@/hooks/useHasMounted'; // 🆕

function HeartIconButton({ productId }: { productId: string }) {
    const hasToken = !!Cookies.get('token');
    const { addToWishlist, removeFromWishlist, isInWishlist, isPending, isLoading } = useWishlist(hasToken);
    const mounted = useHasMounted(); // 🆕 بدل useState + useEffect

    const exists = isInWishlist(productId);
    const loading = isPending(productId) || isLoading;

    if (!mounted) {
        return (
            <button className="bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-2.5 right-2.5 cursor-pointer flex items-center justify-center transition-all">
                <HeartOutline className="h-6 w-6 text-gray-700 translate-y-[1px]" />
            </button>
        );
    }

    return (
        <button
            className="bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-2.5 right-2.5 cursor-pointer flex items-center justify-center transition-all"
            disabled={loading}
            onClick={() => {
                exists ? removeFromWishlist(productId) : addToWishlist(productId);
            }}
        >
            {loading ? (
                <LoadingSvg />
            ) : exists ? (
                <HeartSolid className="h-6 w-6 text-red-500 translate-y-[1px]" />
            ) : (
                <HeartOutline className="h-6 w-6 text-gray-700 translate-y-[1px]" />
            )}
        </button>
    );
}

export default HeartIconButton;