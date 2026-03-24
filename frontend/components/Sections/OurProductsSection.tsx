import React from 'react'
import Container from '../Container'
import SectionTitle from './SectionTitel'
import { CardsCarousel } from '../CarouselPlugin/CardsCarousel'
import StyledButton from "@/components/StyledButton"
import type { Product } from '@/types/api'

interface OurProductsSectionProps {
    products: Product[];
}

function OurProductsSection({ products }: OurProductsSectionProps) {
    return (
        <section className="py-17">
            <Container>
                <div>
                    <SectionTitle Category="Our Products" title="Explore Our Products" />
                </div>
                <div className="pt-5">
                    <CardsCarousel type="products-grid" data={products} />
                </div>
                <div className="flex justify-center pt-16">
                    <StyledButton title="View All Products" />
                </div>
            </Container>
        </section>
    )
}

export default OurProductsSection