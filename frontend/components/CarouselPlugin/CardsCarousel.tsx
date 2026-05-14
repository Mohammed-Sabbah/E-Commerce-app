import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import ProductCard from "@/components/ProductCard"
import CatigoryCard from "@/components/CatigoryCard"
import type { Product, Category } from "@/types/api"

interface BaseProps {
    type: "products" | "categories" | "products-grid"
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
    const { type, data } = props

    if (type === "products-grid") {
        const pairs: Product[][] = []
        for (let i = 0; i < data.length; i += 2) {
            pairs.push((data as Product[]).slice(i, i + 2))
        }

        return (
            <Carousel opts={{ align: "start" }} className="w-full overflow-visible">
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
                <CarouselPrevious className="absolute -top-12 right-10 left-auto translate-y-0" />
                <CarouselNext className="absolute -top-12 right-0 left-auto translate-y-0" />
            </Carousel>
        )
    }

    return (
        <Carousel opts={{ align: "start" }} className="w-full overflow-visible">
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
            <CarouselPrevious className="absolute -top-12 right-10 left-auto translate-y-0" />
            <CarouselNext className="absolute -top-12 right-0 left-auto translate-y-0" />
        </Carousel>
    )
}