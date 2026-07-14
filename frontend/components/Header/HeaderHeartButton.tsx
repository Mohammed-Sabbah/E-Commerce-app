"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { HeartIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "@/i18n/navigation";

function HeaderHeartButton({ token }: { token?: string }) {
    const t = useTranslations('nav');
    const { wishlist } = useWishlist(!!token);
    const router = useRouter();

    const count = wishlist.length;
    const displayCount = count > 99 ? "99+" : count;

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (count === 0) return;
        const frame = requestAnimationFrame(() => setAnimate(true));
        const timeout = setTimeout(() => setAnimate(false), 300);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timeout);
        };
    }, [count]);

    return (
        <button
            onClick={() => router.push("/wishlist")}
            aria-label={t('wishlist')}
            className="relative flex items-center justify-center cursor-pointer"
        >
            <HeartIcon className="h-6 w-6 transition-transform duration-200 hover:scale-120" />

            {count > 0 && (
                <span
                    className={`
                        absolute -top-0 -end-1
                        bg-red-500 text-white text-[10px]
                        min-w-[16px] h-[16px] px-[3px]
                        flex items-center justify-center
                        rounded-full
                        transition-all duration-200
                        ${animate ? "scale-125" : "scale-100"}
                    `}
                >
                    {displayCount}
                </span>
            )}
        </button>
    );
}

export default HeaderHeartButton;