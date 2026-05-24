import { CardsCarousel } from "@/components/CarouselPlugin/CardsCarousel";
import { getProducts } from "@/services/server/pruductService";

export default async function FlashSalesCarousel() {
    const products = await getProducts({
        discount: "true",
        limit: 10,
    });
    const flashSales = products.data.docs

    return <CardsCarousel type="products" data={flashSales} />
}