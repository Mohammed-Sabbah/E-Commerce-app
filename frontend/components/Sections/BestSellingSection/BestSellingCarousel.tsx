import { CardsCarousel } from "@/components/CarouselPlugin/CardsCarousel";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/server/pruductService";

export default async function BestSellingCarousel() {
    const products = await getProducts({ sort: "-sold", limit: 4 });
    const bestSelling = products.data.docs

    return (
        <>
            {bestSelling.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </>
    )
}