'use client'
import Container from "@/components/Container";
import WishlistEmptyState from "@/components/WishList/WishlistEmptyState";
import WishlistGrid from "@/components/WishList/WishlistGrid";
import WishlistHeader from "@/components/WishList/WishlistHeader";
import { useWishlist } from "@/hooks/useWishlist";


export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="min-h-[60vh]">
            <section>
                <Container>
                    <WishlistHeader count={wishlist.length} />

                    {wishlist.length === 0 ? (
                        <WishlistEmptyState />
                    ) : (
                        <div className="pb-16">
                            <WishlistGrid wishlist={wishlist} />
                        </div>
                    )}
                </Container>
            </section>
        </div>
    );
}