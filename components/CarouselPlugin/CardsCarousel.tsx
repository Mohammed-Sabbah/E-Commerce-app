import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function CardsCarousel({ children, type }: {
    children: React.ReactNode,
    type: "products" | "catigorys" | "products-grid"
}) {
    if (type === "products-grid") {
        const items = Array.from({ length: 8 })
        const pairs: any[][] = []
        for (let i = 0; i < items.length; i += 2) {
            pairs.push(items.slice(i, i + 2))
        }

        return (
            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                    {pairs.map((pair, index) => (
                        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
                            <div className="flex flex-col gap-4">
                                {pair.map((_, i) => (
                                    <div key={i}>{children}</div>
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
        <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="w-full">
                {Array.from({ length: 7 }).map((_, index) => (
                    <CarouselItem
                        key={index}
                        className={
                            type === "products"
                                ? "max-w-68 basis-full sm:basis-1/2 lg:basis-1/3"
                                : "h-36 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                        }
                    >
                        {children}
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -top-12 right-10 left-auto translate-y-0" />
            <CarouselNext className="absolute -top-12 right-0 left-auto translate-y-0" />
        </Carousel>
    )
}