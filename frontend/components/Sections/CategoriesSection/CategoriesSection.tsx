import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import { getTranslations } from 'next-intl/server';

async function CategoriesSection({ children }: { children: React.ReactNode }) {
    const t = await getTranslations('products');
    return (
        <section className="pb-15">
            <Container>
                <hr className="pb-12 md:pb-20" />

                <div>
                    <SectionTitle Category={t('categories')} title={t('browseByCategory')} />
                </div>

                <div className="pt-8">
                    {children}
                </div>
            </Container>
        </section>
    )
}

export default CategoriesSection