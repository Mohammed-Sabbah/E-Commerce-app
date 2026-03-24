import React from 'react'
import Container from '../Container'
import SectionTitle from './SectionTitel'
import ProductCard from '../ProductCard'
import StyledButton from "@/components/StyledButton"
import type { Product } from '@/types/api'

interface BestSellingSectionProps {
    products: Product[];
}

function BestSellingSection({ products }: BestSellingSectionProps) {
    return (
        <section>
            <Container>
                <hr className="pb-12 md:pb-20" />

                <div className="flex justify-between items-end">
                    <SectionTitle Category="This Month" title="Best Selling Products" />
                    <StyledButton title="View All" ClassName="px-9 py-3.5 h-12" />
                </div>
                <div className="pt-5 flex flex-wrap justify-between">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product._id} product={product} className="max-w-68 basis-full" />
                    ))}
                </div>
            </Container>
        </section>
    )
}

export default BestSellingSection