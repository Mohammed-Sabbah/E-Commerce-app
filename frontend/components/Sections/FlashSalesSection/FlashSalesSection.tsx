import React, { Suspense } from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import Timer from '../../Timer'
import { CardsCarousel } from '../../CarouselPlugin/CardsCarousel'
import StyledButton from "@/components/StyledButton";
import { getProducts } from "@/services/server/pruductService";
import FlashSalesCarousel from './FlashSalesCarousel'
import SectionSkeleton from '../ProductsSkeleton'



function FlashSalesSection() {
    return (
        <section className="mb-16 md:mb-20">
            <Container className="relative">
                <SectionTitle Category="Today's" title="Flash Sales">
                    <Timer />
                </SectionTitle>

                <div className="pt-5">
                    <Suspense fallback={<SectionSkeleton />}>
                        <FlashSalesCarousel />
                    </Suspense>
                </div>

                <div className="flex justify-center pt-16">
                    <StyledButton title="View All Products" />
                </div>
            </Container>
        </section>
    )
}

export default FlashSalesSection