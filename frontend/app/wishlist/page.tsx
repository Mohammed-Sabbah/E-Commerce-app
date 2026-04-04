'use client'
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {

    const { wishlist } = useWishlist();



    if (!wishlist.length) {
        return <p className="text-center mt-10">No items in wishlist</p>;
    }

    return (
        <div>
            <section>
                <Container>
                    <div className="flex items-center gap-2 my-14">
                        <h1 className="text-2xl font-bold ">
                            Wishlist ({wishlist?.length || 0})
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {wishlist.map((product) => (
                            <ProductCard key={product._id} product={product} variant="wishlist" />
                        ))}
                    </div>
                </Container>
            </section>


        </div>
    );
}