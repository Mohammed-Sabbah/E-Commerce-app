import { Star } from "lucide-react"

interface RatingProps {
    rating: number
    maxStars?: number
    size?: number
    reviews?: number
}

export function StarsComponent({ rating, maxStars = 5, size = 20, reviews }: RatingProps) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxStars }).map((_, i) => {
                const filled = i < Math.floor(rating)
                const partial = !filled && i < rating

                return (
                    <div key={i} className="relative" style={{ width: size, height: size }}>
                        <Star
                            size={size}
                            className="text-gray-300"
                            fill="currentColor"
                        />
                        {(filled || partial) && (
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: filled ? "100%" : `${(rating % 1) * 100}%` }}
                            >
                                <Star
                                    size={size}
                                    className="text-[#FFAD33]"
                                    fill="currentColor"
                                />
                            </div>
                        )}
                    </div>
                )
            })}
            {reviews !== undefined && (
                <span className="text-sm text-gray-500 ml-1">({reviews})</span>
            )}
        </div>
    )
}