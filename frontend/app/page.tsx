import HeaderCarouselSection from "@/components/Sections/HeaderCarouselSection";
import FlashSalesSection from "@/components/Sections/FlashSalesSection";
import CategoriesSection from "@/components/Sections/CategoriesSection";
import CatigoryHeroSection from "@/components/Sections/CatigoryHeroSection";
import OurProductsSection from "@/components/Sections/OurProductsSection";
import NewArrivalSection from "@/components/Sections/NewArrivalSection";
import FeaturesSection from "@/components/Sections/FeaturesSection";
import BestSellingSection from "@/components/Sections/BestSellingSection";
import { getCategories, getProducts } from "@/services/server/pruductService";

export default async function Home() {

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const productDocs = Array.isArray(products?.data?.docs) ? products.data.docs : [];
  // const bestSelling = [...productDocs]
  //   .sort((a, b) => b.sold - a.sold)
  //   .slice(0, 15);

  // const flashSales = productDocs
  //   .filter((p) => p.priceAfterDiscount)
  //   .slice(0, 15);

  // const newArrivals = [...productDocs]
  //   .sort(
  //     (a, b) =>
  //       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //   )
  //   .slice(0, 4);


    const bestSelling = [...products.data.docs]
  .sort((a, b) => b.sold - a.sold)
  .slice(0, 8);

const newArrivals = [...products.data.docs]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 4);

const flashSales = products.data.docs
  .filter(p => p.priceAfterDiscount)
  .slice(0, 10);



  return (
    <div>
      <HeaderCarouselSection />

      {/* Flash Sales Section */}
      <FlashSalesSection products={flashSales} />

      {/* Categories Section */}
      <CategoriesSection categories={categories.data?.docs} />

      {/* Best Selling products */}
      <BestSellingSection products={bestSelling} />

      <CatigoryHeroSection />

      {/* Our Products */}
      <OurProductsSection products={productDocs} />

      <NewArrivalSection />

      <FeaturesSection />
    </div>
  );
}
