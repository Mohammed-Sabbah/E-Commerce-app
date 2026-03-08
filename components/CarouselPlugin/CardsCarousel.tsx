import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function CardsCarousel({ children ,type }: { children: React.ReactNode, type: "products"|"catigorys" }) {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full"
        >
            <CarouselContent className="w-full pb-14 md:pb-0">
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
            <CarouselPrevious className="top-auto bottom-0 left-2 -translate-y-0 md:top-1/2 md:-left-12 md:-translate-y-1/2" />
            <CarouselNext className="top-auto bottom-0 right-2 -translate-y-0 md:top-1/2 md:-right-12 md:-translate-y-1/2" />
        </Carousel>
    )
}
