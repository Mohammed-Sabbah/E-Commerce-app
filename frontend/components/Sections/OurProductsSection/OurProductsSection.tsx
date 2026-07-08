import { getTranslations } from 'next-intl/server';
import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import StyledButton from "@/components/StyledButton"

async function OurProductsSection({ children }: { children: React.ReactNode }) {
    const t = await getTranslations('common');
    const tp = await getTranslations('products');
    return (
        <section className="py-17">
            <Container>
                <div>
                    <SectionTitle Category={tp('ourProducts')} title={tp('exploreOurProducts')} />
                </div>

                <div className="pt-8">
                    {children}
                </div>

                <div className="flex justify-center pt-16">
                    <StyledButton title={t('viewAll')} href="/products" />
                </div>
            </Container>
        </section>
    )
}

export default OurProductsSection