import React from 'react'
import Container from '../Container'
import SectionTitle from './SectionTitel'
import { CardsCarousel } from '../CarouselPlugin/CardsCarousel'
import type { Category } from '@/types/api'

interface CategoriesSectionProps {
    categories: Category[];
}

function CategoriesSection({ categories=[] }: CategoriesSectionProps) {
    return (
        <section className="pb-15">
            <Container>
                <hr className="pb-12 md:pb-20" />

                <div>
                    <SectionTitle Category="Categories" title="Browse By Category" />
                </div>

                <div className="pt-5">
                    <CardsCarousel type="categories" data={categories} />
                </div>

            </Container>
        </section>
    )
}

export default CategoriesSection