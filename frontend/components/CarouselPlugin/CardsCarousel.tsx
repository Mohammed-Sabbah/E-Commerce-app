import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import ProductCard from "@/components/ProductCard"
import CatigoryCard from "@/components/CatigoryCard"
import type { Product, Category } from "@/types/api"

interface BaseProps {
    type: "products" | "categories" | "products-grid"
    setApi?: (api: CarouselApi) => void
    hideControls?: boolean
    controlsOffset?: number
}

interface ProductsProps extends BaseProps {
    type: "products" | "products-grid"
    data: Product[]
}

interface CategoriesProps extends BaseProps {
    type: "categories"
    data: Category[]
}

type CardsCarouselProps = ProductsProps | CategoriesProps

export function CardsCarousel(props: CardsCarouselProps) {
    const { type, data, setApi, hideControls = false, controlsOffset = 12 } = props

    const btnPrev = `"absolute -top-8 md:-top-14 right-10 left-auto translate-y-0`
    const btnNext = `absolute -top-8 md:-top-14 right-0 left-auto translate-y-0`

    if (type === "products-grid") {
        const pairs: Product[][] = []
        for (let i = 0; i < data.length; i += 2) {
            pairs.push((data as Product[]).slice(i, i + 2))
        }

        return (
            <Carousel opts={{ align: "start" }} setApi={setApi} className="w-full overflow-visible">
                <CarouselContent>
                    {pairs.map((pair, index) => (
                        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
                            <div className="flex flex-col gap-10">
                                {pair.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {!hideControls && <CarouselPrevious className={btnPrev} />}
                {!hideControls && <CarouselNext className={btnNext} />}
            </Carousel>
        )
    }

    return (
        <Carousel opts={{ align: "start" }} setApi={setApi} className="w-full overflow-visible">
            <CarouselContent className="w-full">
                {type === "products"
                    ? (data as Product[]).map((product) => (
                        <CarouselItem
                            key={product._id}
                            className="max-w-68 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))
                    : (data as Category[]).map((category) => (
                        <CarouselItem
                            key={category._id}
                            className="h-36 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                        >
                            <CatigoryCard category={category} />
                        </CarouselItem>
                    ))
                }
            </CarouselContent>
            {!hideControls && <CarouselPrevious className={btnPrev} />}
            {!hideControls && <CarouselNext className={btnNext} />}
        </Carousel>
    )
}