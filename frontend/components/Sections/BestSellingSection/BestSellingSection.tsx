import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import StyledButton from "@/components/StyledButton"

function BestSellingSection({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <Container>
                <hr className="pb-12 md:pb-20" />

                <div className="flex justify-between items-end">
                    <SectionTitle Category="This Month" title="Best Selling Products" />
                    <StyledButton title="View All" href="/products?sort=-sold" ClassName="px-9 py-3.5 h-12" />
                </div>

                <div className="pt-5 flex flex-wrap justify-between">
                    {children}
                </div>
            </Container>
        </section>
    )
}

export default BestSellingSection