import ProductCard from "@/components/ProductCard";
import { ProductCardData } from "@/components/ProductCard";

interface WishlistGridProps {
    wishlist: ProductCardData[];
}

export default function WishlistGrid({ wishlist }: WishlistGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {wishlist.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    variant="wishlist"
                />
            ))}
        </div>
    );
}