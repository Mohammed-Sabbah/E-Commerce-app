"use client";

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-9 px-3 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                Prev
            </button>
            {start > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => onPageChange(1)}
                        className="h-9 w-9 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        1
                    </button>
                    {start > 2 && <span className="text-gray-400 text-sm">...</span>}
                </>
            )}
            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`h-9 w-9 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        p === currentPage
                            ? "bg-gray-900 text-white"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    {p}
                </button>
            ))}
            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="text-gray-400 text-sm">...</span>}
                    <button
                        type="button"
                        onClick={() => onPageChange(totalPages)}
                        className="h-9 w-9 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        {totalPages}
                    </button>
                </>
            )}
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-9 px-3 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                Next
            </button>
        </div>
    );
}
