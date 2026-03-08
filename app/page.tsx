import { CarouselPlugin } from "@/components/CarouselPlugin";
import { CardsCarousel } from "@/components/CarouselPlugin/CardsCarousel";
import { CollapsibleTree } from "@/components/CollapsibleTree";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import CatigoryCard from "@/components/CatigoryCard";
import StyledButton from "@/components/StyledButton";
import SectionTitle from "@/components/Section/SectionTitel";
import Timer from "@/components/Timer";

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

      {/* Products Section */}
      <section className="mb-16 md:mb-20">
        <Container>
          <div className="section-header flex justify-start items-end space-x-25">
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


      <section>
        <Container>
          <hr className="pb-12 md:pb-20" />

          <div className="section-header flex flex-col items-start gap-4 md:gap-6">
            <SectionTitle Category="Categories" title="Browse By Category" />
          </div>

          <div className="pt-5">
            <CardsCarousel type="catigorys">
              <CatigoryCard />
            </CardsCarousel>
          </div>

        </Container>
      </section>
    </div>
  );
}
