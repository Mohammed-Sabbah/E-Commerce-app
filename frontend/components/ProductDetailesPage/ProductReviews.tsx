"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Review } from "@/types/api";
import { StarsComponent } from "../ProductCard/StarsComponent";
import { Star } from "lucide-react";

interface Props {
    productId: string;
}

const INITIAL_VISIBLE = 4;

export default function ProductReviews({ productId }: Props) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [showAll, setShowAll] = useState(false);

    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [myReview, setMyReview] = useState<Review | null>(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [reviewsRes, profileRes] = await Promise.all([
                    apiClient.get(`/api/v1/products/${productId}/reviews`),
                    apiClient.get("/api/v1/users/myProfile").catch(() => null),
                ]);

                const docs: Review[] = reviewsRes.data?.data?.docs ?? [];
                const uid = profileRes?.data?.data?.doc?._id ?? null;
                const uname = profileRes?.data?.data?.doc?.name ?? "";

                setReviews(docs);
                setUserId(uid);
                setUserName(uname);

                if (uid) {
                    const found = docs.find(r => r.user._id === uid);
                    if (found) {
                        setMyReview(found);
                        setRating(found.rating);
                        setComment(found.comment);
                    }
                }
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [productId]);

    async function handleSubmit() {
        if (!rating || !comment.trim()) {
            setError("Please add a rating and comment.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            if (myReview && editMode) {
                await apiClient.patch(`/api/v1/reviews/${myReview._id}`, {
                    rating,
                    comment,
                    product: productId,
                });
                const updated: Review = { ...myReview, rating, comment };
                setReviews(prev => prev.map(r => r._id === myReview._id ? updated : r));
                setMyReview(updated);
                setEditMode(false);
            } else {
                const res = await apiClient.post(`/api/v1/products/${productId}/reviews`, {
                    rating,
                    comment,
                });
                const created: Review = res.data?.data?.newDoc;
                const createdWithUser: Review = {
                    ...created,
                    user: {
                        _id: userId!,
                        name: created.user?.name ?? userName,
                    },
                };
                setReviews(prev => [createdWithUser, ...prev]);
                setMyReview(createdWithUser);
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            setError(e?.response?.data?.message ?? "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!myReview) return;
        setSubmitting(true);
        setError(null);
        try {
            await apiClient.delete(`/api/v1/reviews/${myReview._id}`);
            setReviews(prev => prev.filter(r => r._id !== myReview._id));
            setMyReview(null);
            setRating(0);
            setComment("");
        } catch {
            setError("Failed to delete review.");
        } finally {
            setSubmitting(false);
        }
    }

    const otherReviews = reviews.filter(r => r.user._id !== userId);
    const visibleOthers = showAll ? otherReviews : otherReviews.slice(0, myReview ? INITIAL_VISIBLE - 1 : INITIAL_VISIBLE);
    const hasMore = otherReviews.length > visibleOthers.length;

    return (
        <section className="mt-16 pt-10 border-t border-gray-200 pb-16">

            {/* Header */}
            <div className="flex items-center justify-between pt-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">
                    Customer Reviews
                    <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>
                </h3>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <StarsComponent rating={reviews.reduce((s, r) => s + r.rating, 0) / reviews.length} size={16} />
                        <span className="text-sm text-gray-500">
                            {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} / 5
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* يسار: قائمة الـ reviews */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-6 h-6 border-2 border-[#DB4444] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Star size={32} className="text-gray-200 mb-3" fill="currentColor" />
                            <p className="text-gray-400 text-sm">No reviews yet.</p>
                            <p className="text-gray-300 text-xs mt-1">Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <>
                            {/* review اليوزر أولاً */}
                            {myReview && !editMode && (
                                <div className="p-4 rounded-xl border border-[#DB4444]/25 bg-red-50/30">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#DB4444] text-white flex items-center justify-center text-sm font-semibold shrink-0">
                                                {myReview.user.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {myReview.user.name}
                                                    <span className="ml-2 text-[10px] font-medium text-white bg-[#DB4444] px-1.5 py-0.5 rounded-full">You</span>
                                                </p>
                                                <StarsComponent rating={myReview.rating} size={13} />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 shrink-0">
                                            <button onClick={() => setEditMode(true)}
                                                className="text-xs text-gray-400 hover:text-gray-700 transition">
                                                Edit
                                            </button>
                                            <button onClick={handleDelete} disabled={submitting}
                                                className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{myReview.comment}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(myReview.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}

                            {/* باقي الـ reviews */}
                            {visibleOthers.map(review => (
                                <div key={review._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/40">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold shrink-0">
                                            {review.user.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
                                            <StarsComponent rating={review.rating} size={13} />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(review.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </p>
                                </div>
                            ))}

                            {/* Show more / less */}
                            {(hasMore || showAll) && (
                                <button
                                    onClick={() => setShowAll(prev => !prev)}
                                    className="w-full py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition"
                                >
                                    {showAll
                                        ? "Show less"
                                        : `Show ${otherReviews.length - visibleOthers.length} more review${otherReviews.length - visibleOthers.length > 1 ? "s" : ""}`
                                    }
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* يمين: فورم */}
                <div>
                    {myReview && !editMode ? (
                        <div className="flex flex-col items-center justify-center text-center py-8 px-6 border border-dashed border-gray-200 rounded-xl h-fit">
                            <Star size={28} className="text-[#FFAD33] mb-3" fill="currentColor" />
                            <p className="text-sm text-gray-500">You already reviewed this product.</p>
                            <button
                                onClick={() => setEditMode(true)}
                                className="mt-3 text-sm text-[#DB4444] hover:underline"
                            >
                                Edit your review
                            </button>
                        </div>
                    ) : (
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h4 className="text-sm font-semibold text-gray-800 mb-6">
                                {editMode ? "Edit your review" : "Write a Review"}
                            </h4>

                            {/* Star picker */}
                            <div className="mb-5">
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Your Rating</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHovered(star)}
                                            onMouseLeave={() => setHovered(0)}
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={28}
                                                className={`transition-colors ${(hovered || rating) >= star ? "text-[#FFAD33]" : "text-gray-200"}`}
                                                fill="currentColor"
                                            />
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <p className="text-xs text-gray-400 mt-1.5">
                                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                                    </p>
                                )}
                            </div>

                            {/* Comment */}
                            <div className="mb-5">
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Your Comment</p>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="Share your experience with this product..."
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:border-[#DB4444] transition placeholder:text-gray-300"
                                />
                                <p className="text-xs text-gray-300 text-right mt-1">{comment.length} chars</p>
                            </div>

                            {error && (
                                <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                                    <p className="text-xs text-red-500">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 bg-[#DB4444] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#c03a3a] transition disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : editMode ? "Update Review" : "Submit Review"}
                                </button>
                                {editMode && (
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setRating(myReview!.rating);
                                            setComment(myReview!.comment);
                                            setError(null);
                                        }}
                                        className="px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}