import HeaderCarouselSection from "@/components/Sections/HeaderCarouselSection/HeaderCarouselSection";
import FlashSalesSection from "@/components/Sections/FlashSalesSection/FlashSalesSection";
import CategoriesSection from "@/components/Sections/CategoriesSection/CategoriesSection";
import CatigoryHeroSection from "@/components/Sections/CatigoryHeroSection/CatigoryHeroSection";
import OurProductsSection from "@/components/Sections/OurProductsSection/OurProductsSection";
import NewArrivalSection from "@/components/Sections/NewArrivalSection/NewArrivalSection";
import FeaturesSection from "@/components/Sections/FeaturesSection/FeaturesSection";
import BestSellingSection from "@/components/Sections/BestSellingSection/BestSellingSection";
import { getCategories, getProducts } from "@/services/server/pruductService";

export default async function Home() {

  

 


  return (
    <div>
      <HeaderCarouselSection />

      {/* Flash Sales Section */}
      <FlashSalesSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Best Selling products */}
      <BestSellingSection  />

      <CatigoryHeroSection />

      {/* Our Products */}
      <OurProductsSection />

      <NewArrivalSection />

      <FeaturesSection />
    </div>
  );
}
