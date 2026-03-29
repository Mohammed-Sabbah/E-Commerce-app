import { CardsCarousel } from "@/components/CarouselPlugin/CardsCarousel";
import { getProducts } from "@/services/server/pruductService";

export default async function OurProductsCarousel() {
    const products = await getProducts();
    const productDocs = Array.isArray(products?.data?.docs) ? products.data.docs : [];


    return <CardsCarousel type="products-grid" data={productDocs} />
}