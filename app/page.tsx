import { CarouselPlugin } from "@/components/CarouselPlugin";
import { CardsCarousel } from "@/components/CarouselPlugin/CardsCarousel";
import { CollapsibleTree } from "@/components/CollapsibleTree";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import CatigoryCard from "@/components/CatigoryCard";
import StyledButton from "@/components/StyledButton";
import SectionTitle from "@/components/Section/SectionTitel";
import Timer from "@/components/Timer";
import index from "@/components/CatigoryCard";
import { CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import CatigoryHero from "@/components/CatigoryHero";

export default function Home() {
  return (
    <div>
      <section className="border-t-[1.5px] border-gray-300">
        <Container className="flex">
          <div className="flex-1/5">
            <CollapsibleTree ClassName="p-5 border-r-[1.5px] border-gray-300 max-h-98 overflow-y-auto" />
          </div>
          <div className="flex-4/5 p-10 pr-0">
            <CarouselPlugin ClassName="rounded-none" />
          </div>
        </Container>
      </section>

      {/* Flash Sales Section */}
      <section className="mb-16 md:mb-20">
        <Container className="relative">
          <div>
            <SectionTitle Category="Today's" title="Flash Sales" >
              <Timer />
            </SectionTitle>
          </div>
          <div className="pt-5">
            <CardsCarousel type="products" >
              <ProductCard />
            </CardsCarousel>
          </div>
          <div className="flex justify-center pt-16">
            <StyledButton title="View All Products" />
          </div>
        </Container>
      </section>

      {/* Categories Section  */}
      <section className="pb-15">
        <Container>
          <hr className="pb-12 md:pb-20" />

          <div>
            <SectionTitle Category="Categories" title="Browse By Category" />
          </div>

          <div className="pt-5">
            <CardsCarousel type="catigorys">
              <CatigoryCard />
            </CardsCarousel>
          </div>

        </Container>
      </section>

      {/* Best Selling products */}
      <section>
        <Container>
          <hr className="pb-12 md:pb-20" />

          <div className="flex justify-between items-end">
            <SectionTitle Category="This Month" title="Best Selling Products" />
            <StyledButton title="View All" ClassName="px-9 py-3.5 h-12" />
          </div>
          <div className="pt-5 flex flex-wrap justify-between">
            {
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCard key={index} className="max-w-68 basis-full" />
              ))
            }
          </div>
        </Container>
      </section>

      <section className="py-17">
        <Container>
          <CatigoryHero />
        </Container>
      </section>

      {/* Our Products */}
      <section className="py-17">
        <Container>
          <div>
            <SectionTitle Category="Our Products" title="Explore Our Products" />
          </div>
          <div className="pt-5">
            <CardsCarousel type="products-grid">
              <ProductCard />
            </CardsCarousel>
          </div>
        </Container>
      </section>
    </div>
  );
}
