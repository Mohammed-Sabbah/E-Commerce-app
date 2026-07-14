import ReviewsClient from "@/components/Account/ReviewsClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.API_URL;

export interface UserReview {
    _id: string;
    product: {
        _id: string;
        name: string;
        coverImage: string;
    };
    comment: string;
    rating: number;
    createdAt: string;
}

async function getMyReviews(): Promise<UserReview[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) redirect("/login");

    try {
        const res = await fetch(`${API}/api/v1/users/myReviews`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data?.data?.docs ?? [];
    } catch {
        return [];
    }
}

export default async function MyReviewsPage() {
    const reviews = await getMyReviews();
    return <ReviewsClient reviews={reviews} />;
}