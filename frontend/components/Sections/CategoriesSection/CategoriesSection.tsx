import React, { Suspense } from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import { CardsCarousel } from '../../CarouselPlugin/CardsCarousel'
import type { Category } from '@/types/api'
import CategoriesCarousel from './CategoriesCarousel'
import CategoriesSkeleton from '../CategoriesSkeleton'


function CategoriesSection() {
    return (
        <section className="pb-15">
            <Container>
                <hr className="pb-12 md:pb-20" />

                <div>
                    <SectionTitle Category="Categories" title="Browse By Category" />
                </div>

                <div className="pt-5">
                    <Suspense fallback={<CategoriesSkeleton/>}>
                        <CategoriesCarousel/>
                    </Suspense>
                </div>

            </Container>
        </section>
    )
}

export default CategoriesSection