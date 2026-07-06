import { getTranslations } from 'next-intl/server';
import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import StyledButton from "@/components/StyledButton"

async function BestSellingSection({ children }: { children: React.ReactNode }) {
    const t = await getTranslations('common');
    return (
        <section>
            <Container>
                <hr className="pb-12 md:pb-20" />

                <div className="flex justify-between items-end">
                    <SectionTitle Category="This Month" title="Best Selling Products" />
                    <div className="hidden md:block">
                        <StyledButton title={t('viewAll')} href="/products?sort=-sold" ClassName="px-9 py-3.5 h-12" />
                    </div>
                </div>

                <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {children}
                </div>

                <div className="flex justify-center pt-8 md:hidden">
                    <StyledButton title={t('viewAll')} href="/products?sort=-sold" ClassName="px-9 py-3.5 h-12" />
                </div>
            </Container>
        </section>
    )
}

export default BestSellingSection