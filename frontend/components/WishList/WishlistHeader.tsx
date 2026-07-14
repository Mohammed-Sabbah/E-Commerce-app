interface WishlistHeaderProps {
    count: number;
    title?: string;
}

export default function WishlistHeader({ count, title = "Wishlist" }: WishlistHeaderProps) {
    return (
        <div className="flex items-center gap-2 my-10 sm:my-14">
            <h1 className="text-xl sm:text-2xl font-bold">
                {title} ({count})
            </h1>
        </div>
    );
}