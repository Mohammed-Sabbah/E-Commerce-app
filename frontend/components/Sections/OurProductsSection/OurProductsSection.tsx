import React, { Suspense } from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import { CardsCarousel } from '../../CarouselPlugin/CardsCarousel'
import StyledButton from "@/components/StyledButton"
import type { Product } from '@/types/api'
import OurProductsCarousel from './OurProductsCarousel'
import SectionSkeleton from '../ProductsSkeleton'


function OurProductsSection() {
    return (
        <section className="py-17">
            <Container>
                <div>
                    <SectionTitle Category="Our Products" title="Explore Our Products" />
                </div>
                <div className="pt-5">
                    <Suspense fallback={<SectionSkeleton />}>
                        <OurProductsCarousel />
                    </Suspense>                </div>
                <div className="flex justify-center pt-16">
                    <StyledButton title="View All Products" />
                </div>
            </Container>
        </section>
    )
}

export default OurProductsSection