"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const content = Array.from({ length: 5 });

export function CarouselPlugin({ ClassName }: { ClassName?: string }) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    )
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)

    React.useEffect(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    return (
        <div className="flex flex-col items-center gap-3">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className={`w-full ${ClassName}`}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {content.map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card className="rounded-none shadow-none h-98">
                                    <CardContent className="flex aspect-auto items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />

                <div className="flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2">
                    {content.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={`h-3 w-3 rounded-full transition-all duration-300  ${index === current ? "bg-[#DB4444]" : " bg-gray-300"
                                }`}
                        />
                    ))}
                </div>

            </Carousel>

            {/* Dots */}

        </div>
    )
}