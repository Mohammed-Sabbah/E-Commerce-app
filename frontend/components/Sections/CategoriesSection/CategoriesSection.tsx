import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'

function CategoriesSection({ children }: { children: React.ReactNode }) {
    return (
        <section className="pb-15">
            <Container>
                <hr className="pb-12 md:pb-20" />

                <div>
                    <SectionTitle Category="Categories" title="Browse By Category" />
                </div>

                <div className="pt-5">
                    {children}
                </div>
            </Container>
        </section>
    )
}

export default CategoriesSection