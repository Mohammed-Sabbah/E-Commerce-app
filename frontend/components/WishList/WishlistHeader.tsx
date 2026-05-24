interface WishlistHeaderProps {
    count: number;
}

export default function WishlistHeader({ count }: WishlistHeaderProps) {
    return (
        <div className="flex items-center gap-2 my-10 sm:my-14">
            <h1 className="text-xl sm:text-2xl font-bold">
                Wishlist ({count})
            </h1>
        </div>
    );
}