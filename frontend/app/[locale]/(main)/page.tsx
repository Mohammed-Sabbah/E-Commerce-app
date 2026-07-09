import { Suspense } from "react";
import HeaderCarouselSection from "@/components/Sections/HeaderCarouselSection/HeaderCarouselSection";
import FlashSalesSection from "@/components/Sections/FlashSalesSection/FlashSalesSection";
import CategoriesSection from "@/components/Sections/CategoriesSection/CategoriesSection";
import CatigoryHeroSection from "@/components/Sections/CatigoryHeroSection/CatigoryHeroSection";
import OurProductsSection from "@/components/Sections/OurProductsSection/OurProductsSection";
import NewArrivalSection from "@/components/Sections/NewArrivalSection/NewArrivalSection";
import FeaturesSection from "@/components/Sections/FeaturesSection/FeaturesSection";
import BestSellingSection from "@/components/Sections/BestSellingSection/BestSellingSection";
import FlashSalesCarousel from "@/components/Sections/FlashSalesSection/FlashSalesCarousel";
import CategoriesCarousel from "@/components/Sections/CategoriesSection/CategoriesCarousel";
import BestSellingCarousel from "@/components/Sections/BestSellingSection/BestSellingCarousel";
import OurProductsCarousel from "@/components/Sections/OurProductsSection/OurProductsCarousel";
import SectionSkeleton from "@/components/Sections/ProductsSkeleton";
import CategoriesSkeleton from "@/components/Sections/CategoriesSkeleton";

export default function Home() {
  return (
    <div>
      <HeaderCarouselSection />

      <FlashSalesSection>
        <Suspense fallback={<SectionSkeleton />}>
          <FlashSalesCarousel />
        </Suspense>
      </FlashSalesSection>

      <CategoriesSection>
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesCarousel />
        </Suspense>
      </CategoriesSection>

      <BestSellingSection>
        <Suspense fallback={<SectionSkeleton />}>
          <BestSellingCarousel />
        </Suspense>
      </BestSellingSection>

      <CatigoryHeroSection />

      <OurProductsSection>
        <Suspense fallback={<SectionSkeleton />}>
          <OurProductsCarousel />
        </Suspense>
      </OurProductsSection>

      <NewArrivalSection />
      <FeaturesSection />
    </div>
  );
}