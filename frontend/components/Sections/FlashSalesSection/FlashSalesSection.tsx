import { getTranslations } from 'next-intl/server';
import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import Timer from '../../Timer'
import StyledButton from '@/components/StyledButton'

async function FlashSalesSection({ children }: { children: React.ReactNode }) {
    const t = await getTranslations('common');
    return (
        <section className="mb-16 md:mb-20">
            <Container className="relative">
                <SectionTitle Category="Today's" title="Flash Sales">
                    <Timer />
                </SectionTitle>

                <div className="pt-8 relative">
                    {children}
                </div>

                <div className="flex justify-center pt-16">
                    <StyledButton title={t('viewAll')} href="/products?discount=true" />
                </div>
            </Container>
        </section>
    )
}

export default FlashSalesSection