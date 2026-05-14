import React from 'react'
import Container from '../../Container'
import { CollapsibleTree } from '../../CollapsibleTree'
import { CarouselPlugin } from '../../CarouselPlugin'

function HeaderCarouselSection() {
    return (
        <section>
            <Container className="flex pb-7">
                <div className="hidden lg:block flex-1/5">
                    <CollapsibleTree ClassName="p-5 border-r-[1.5px] border-gray-300 max-h-98 overflow-y-auto" />
                </div>
                <div className="flex-1 lg:flex-4/5 min-w-0 lg:pl-11 pt-10">
                    <CarouselPlugin ClassName="rounded-none " />
                </div>
            </Container>
        </section>
    )
}

export default HeaderCarouselSection