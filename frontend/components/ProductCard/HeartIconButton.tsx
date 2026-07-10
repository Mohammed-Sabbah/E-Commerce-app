'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useWishlist } from '@/hooks/useWishlist';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import LoadingSvg from '../LoadingSvg';
import { useAuth } from '@/context/AuthContext';
import { useHasMounted } from '@/hooks/useHasMounted';

function HeartIconButton({ productId }: { productId: string }) {
    const t = useTranslations('toasts');
    const hasToken = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist, isPending } = useWishlist(hasToken);
    const mounted = useHasMounted();

    const exists = isInWishlist(productId);
    const loading = isPending(productId);

    if (!mounted) {
        return (
            <button className="bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-2.5 end-2.5 cursor-pointer flex items-center justify-center transition-all">
                <HeartOutline className="h-6 w-6 text-gray-700 translate-y-[1px]" />
            </button>
        );
    }

    return (
        <button
            className="bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-2.5 end-2.5 cursor-pointer flex items-center justify-center transition-all"
            disabled={loading}
            onClick={() => {
                if (!hasToken) {
                    toast.error(t('loginRequired'));
                    return;
                }
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