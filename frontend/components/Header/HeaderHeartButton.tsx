"use client";

import React, { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";

function HeaderHeartButton() {
    const { wishlist } = useWishlist();
    const router = useRouter();

    const count = wishlist.length;
    const displayCount = count > 99 ? "99+" : count;

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (count === 0) return;

        const frame = requestAnimationFrame(() => {
            setAnimate(true);
        });

        const timeout = setTimeout(() => {
            setAnimate(false);
        }, 300);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timeout);
        };
    }, [count]);
    return (
        <button
            onClick={() => router.push("/wishlist")}
            className="relative flex items-center justify-center cursor-pointer"
        >
            {/* الأيقونة */}
            <HeartIcon className="h-6 w-6 transition-transform duration-200 hover:scale-110" />

            {/* البادج */}
            {count > 0 && (
                <span
                    className={`
                        absolute -top-1 -right-1
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