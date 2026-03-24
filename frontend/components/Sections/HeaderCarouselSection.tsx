import React from 'react'
import Container from '../Container'
import { CollapsibleTree } from '../CollapsibleTree'
import { CarouselPlugin } from '../CarouselPlugin'

function HeaderCarouselSection() {
    return (
        <section>
            <Container className="flex">
                <div className="flex-1/5">
                    <CollapsibleTree ClassName="p-5 border-r-[1.5px] border-gray-300 max-h-98 overflow-y-auto" />
                </div>
                <div className="flex-4/5 p-10 pr-0">
                    <CarouselPlugin ClassName="rounded-none" />
                </div>
            </Container>
        </section>
    )
}

export default HeaderCarouselSection