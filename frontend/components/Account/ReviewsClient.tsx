"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { apiClient } from "@/lib/apiClient";
import type { UserReview } from "@/app/account/reviews/page";

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({
    rating,
    interactive = false,
    onRate,
}: {
    rating: number;
    interactive?: boolean;
    onRate?: (r: number) => void;
}) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || rating;

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onRate?.(n)}
                    onMouseEnter={() => interactive && setHovered(n)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={interactive ? "cursor-pointer" : "cursor-default"}
                >
                    {n <= active ? (
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                    ) : (
                        <StarOutlineIcon className="w-4 h-4 text-gray-300" />
                    )}
                </button>
            ))}
        </div>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
    review,
    onClose,
    onSave,
}: {
    review: UserReview;
    onClose: () => void;
    onSave: (updated: UserReview) => void;
}) {
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSave() {
        if (!comment.trim()) { setError("Comment cannot be empty"); return; }
        setLoading(true);
        setError("");
        try {
            const res = await apiClient.patch(
                `/api/v1/products/${review.product._id}/reviews/${review._id}`,
                { rating, comment }
            );
            onSave({ ...review, rating, comment, ...res.data?.data?.doc });
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            setError(e?.response?.data?.message ?? "Failed to update review");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Edit Review</h3>

                {/* Product info */}
                <div className="flex items-center gap-3 mb-5 bg-gray-50 rounded-lg p-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 border border-gray-100">
                        <Image src={review.product.coverImage} alt={review.product.name} fill className="object-cover" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 line-clamp-2">{review.product.name}</span>
                </div>

                {/* Rating */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <Stars rating={rating} interactive onRate={setRating} />
                </div>

                {/* Comment */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#DB4444] resize-none transition"
                    />
                </div>

                {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-gray-900 transition px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#DB4444] text-white text-sm font-medium px-6 py-2 rounded-lg hover:bg-[#c73c3c] transition disabled:opacity-60 min-w-[100px]"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({
    review,
    onEdit,
    onDelete,
    deleting,
}: {
    review: UserReview;
    onEdit: () => void;
    onDelete: () => void;
    deleting: boolean;
}) {
    return (
        <div className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            {/* Product image */}
            <Link href={`/products/${review.product._id}`} className="shrink-0">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                    <Image
                        src={review.product.coverImage}
                        alt={review.product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <Link
                    href={`/products/${review.product._id}`}
                    className="text-sm font-medium text-gray-900 hover:text-[#DB4444] transition line-clamp-1"
                >
                    {review.product.name}
                </Link>

                <div className="flex items-center gap-3 mt-1">
                    <Stars rating={review.rating} />
                    <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric"
                        })}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{review.comment}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
                <button
                    onClick={onEdit}
                    title="Edit review"
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    disabled={deleting}
                    title="Delete review"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarOutlineIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No reviews yet</h3>
            <p className="text-sm text-gray-500 mb-6">Products you review will appear here.</p>
            <Link
                href="/products"
                className="inline-block bg-[#DB4444] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#c73c3c] transition"
            >
                Browse Products
            </Link>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReviewsClient({ reviews: initial }: { reviews: UserReview[] }) {
    const [reviews, setReviews] = useState<UserReview[]>(initial);
    const [editing, setEditing] = useState<UserReview | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(review: UserReview) {
        if (!confirm("Delete this review? This action cannot be undone.")) return;
        setDeletingId(review._id);
        try {
            await apiClient.delete(
                `/api/v1/products/${review.product._id}/reviews/${review._id}`
            );
            setReviews((prev) => prev.filter((r) => r._id !== review._id));
        } catch {
            alert("Failed to delete review. Please try again.");
        } finally {
            setDeletingId(null);
        }
    }

    function handleSaved(updated: UserReview) {
        setReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
        setEditing(null);
    }

    return (
        <>
            <div>
                <h2 className="text-[#DB4444] font-medium text-xl mb-1">My Reviews</h2>
                {reviews.length > 0 && (
                    <p className="text-sm text-gray-500 mb-6">
                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </p>
                )}

                {reviews.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="flex flex-col gap-4">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                onEdit={() => setEditing(review)}
                                onDelete={() => handleDelete(review)}
                                deleting={deletingId === review._id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {editing && (
                <EditModal
                    review={editing}
                    onClose={() => setEditing(null)}
                    onSave={handleSaved}
                />
            )}
        </>
    );
}