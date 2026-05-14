import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import StyledButton from "@/components/StyledButton"

function OurProductsSection({ children }: { children: React.ReactNode }) {
    return (
        <section className="py-17">
            <Container>
                <div>
                    <SectionTitle Category="Our Products" title="Explore Our Products" />
                </div>

                <div className="pt-5">
                    {children}
                </div>

                <div className="flex justify-center pt-16">
                    <StyledButton title="View All Products" href="/products" />
                </div>
            </Container>
        </section>
    )
}

export default OurProductsSection