import React from 'react'

function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {/* Image box */}
            <div className="relative bg-[#F5F5F5] rounded overflow-hidden h-52 w-full">
                <div className="absolute inset-0 skeleton-shimmer" />
            </div>
            {/* Title */}
            <div className="h-4 w-3/4 rounded bg-gray-200 overflow-hidden relative">
                <div className="absolute inset-0 skeleton-shimmer" />
            </div>
            {/* Price row */}
            <div className="flex gap-3">
                <div className="h-4 w-16 rounded bg-gray-200 overflow-hidden relative">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>
                <div className="h-4 w-14 rounded bg-gray-200 overflow-hidden relative">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>
            </div>
            {/* Stars row */}
            <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-3 w-4 rounded bg-gray-200 overflow-hidden relative">
                        <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                ))}
                <div className="h-3 w-8 rounded bg-gray-200 ms-1 overflow-hidden relative">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>
            </div>
        </div>
    )
}

function SectionSkeleton() {
    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .skeleton-shimmer::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255,255,255,0.6) 50%,
                        transparent 100%
                    );
                    animation: shimmer 1.4s infinite;
                }
            `}</style>

            {/* Mirrors CarouselContent: overflow hidden + flex row */}
            <div className="overflow-hidden w-full">
                <div className="flex gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-[calc(50%-10px)] md:w-[calc(25%-15px)] xl:w-[calc(20%-16px)]">
                            <ProductCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SectionSkeleton