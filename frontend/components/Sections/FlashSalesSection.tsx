import React from 'react'
import Container from '../Container'
import SectionTitle from './SectionTitel'
import Timer from '../Timer'
import { CardsCarousel } from '../CarouselPlugin/CardsCarousel'
import ProductCard from '../ProductCard'
import StyledButton from "@/components/StyledButton";
import type { Product } from "@/types/api";



function FlashSalesSection({ products }: { products: Product[] }) {
    return (
        <section className="mb-16 md:mb-20">
            <Container className="relative">
                <div>
                    <SectionTitle Category="Today's" title="Flash Sales" >
                        <Timer />
                    </SectionTitle>
                </div>
                <div className="pt-5">
                    <CardsCarousel type="products" data={products} />
                </div>
                <div className="flex justify-center pt-16">
                    <StyledButton title="View All Products" />
                </div>
            </Container>
        </section>
    )
}

export default FlashSalesSection