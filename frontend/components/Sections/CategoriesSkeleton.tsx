import React from 'react'

function CategoryCardSkeleton() {
    return (
        <div className="relative bg-[#F5F5F5] rounded overflow-hidden h-36 w-full">
            <div className="absolute inset-0 skeleton-shimmer" />
        </div>
    )
}

function CategoriesSkeleton() {
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

            <div className="overflow-hidden w-full">
                <div className="flex gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-[calc(50%-10px)] md:w-[calc(25%-15px)] xl:w-[calc(16.666%-14px)]">
                            <CategoryCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default CategoriesSkeleton