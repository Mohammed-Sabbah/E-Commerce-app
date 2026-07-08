import { getTranslations } from 'next-intl/server';
import React from 'react'
import Container from '../../Container'
import SectionTitle from '../SectionTitel'
import NewArrival from '../../NewArrival'

async function NewArrivalSection() {
    const t = await getTranslations('products');
    return (
        <section className="py-17">
            <Container>
                <div>
                    <SectionTitle Category={t('featured')} title={t('newArrival')} />
                </div>
                <div className="pt-8">
                    <NewArrival />
                </div>
            </Container>
        </section>
    )
}

export default NewArrivalSection