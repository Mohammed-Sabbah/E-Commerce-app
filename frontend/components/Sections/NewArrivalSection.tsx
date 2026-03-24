import React from 'react'
import Container from '../Container'
import SectionTitle from './SectionTitel'
import NewArrival from '../NewArrival'

function NewArrivalSection() {
    return (
        <section className="py-17">
            <Container>
                <div>
                    <SectionTitle Category="Featured" title="New Arrival" />
                </div>
                <div className="pt-8">
                    <NewArrival />
                </div>
            </Container>
        </section>
    )
}

export default NewArrivalSection