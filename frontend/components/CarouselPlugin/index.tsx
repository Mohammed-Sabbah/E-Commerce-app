"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"

type Slide = {
    id: number
    productId: string,
    bg: string
    badge: { logo?: string; label: string }
    title: string
    subtitle: string
    cta: string
    image: string
    imageAlt: string
}

const slides: Slide[] = [
    {
        id: 1,
        productId: "6a00639df6c3536c5fb3b101",
        bg: "bg-black",
        badge: { logo: "/images/apple-logo.png", label: "iPhone 14 Series" },
        title: "Up to 10%",
        subtitle: "off Voucher",
        cta: "Shop Now",
        image: "/images/iphone-14.png",
        imageAlt: "iPhone 14 Pro",
    },
    {
        id: 2,
        productId: "69d2565cd47c11c3e447af49",
        bg: "bg-[#1a0a0f]",
        badge: { label: "Chanel" },
        title: "Luxury Scent",
        subtitle: "Save $21",
        cta: "Shop Now",
        image: "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
        imageAlt: "Chanel Coco Noir",
    },
    {
        id: 3,
        productId: "69d2565cd47c11c3e447af46",
        bg: "bg-[#1a0000]",
        badge: { label: "Beauty Collection" },
        title: "Bold & Vibrant",
        subtitle: "From $8.99",
        cta: "Shop Now",
        image: "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
        imageAlt: "Red Lipstick",
    },
    {
        id: 4,
        productId: "69d2565cd47c11c3e447af48",
        bg: "bg-[#0a0f1a]",
        badge: { label: "Calvin Klein" },
        title: "Fresh & Clean",
        subtitle: "Unisex Fragrance",
        cta: "Shop Now",
        image: "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
        imageAlt: "Calvin Klein CK One",
    },
    {
        id: 5,
        productId: "69d2565cd47c11c3e447af45",
        bg: "bg-[#0f0a1a]",
        badge: { label: "Makeup Essentials" },
        title: "Flawless Finish",
        subtitle: "Matte & Smooth",
        cta: "Shop Now",
        image: "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
        imageAlt: "Powder Canister",
    },
]

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
        <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            className={`w-full ${ClassName}`}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="!ml-0">
                {slides.map((slide) => (
                    <CarouselItem key={slide.id} className="!pl-0">
                        <div className={`
                            relative flex items-center justify-between overflow-hidden
                            h-[220px] sm:h-[270px] md:h-[310px] lg:h-[330px] xl:h-[344px]
                            px-6 sm:px-8 lg:px-12 xl:px-16
                            ${slide.bg}
                        `}>

                            {/* Left: Text */}
                            <div className="flex flex-col z-10 flex-1 min-w-0
                                gap-2 sm:gap-3 lg:gap-4 xl:gap-6 pr-2">

                                {/* Badge */}
                                <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
                                    {/* Logo — يظهر بس إذا موجود */}
                                    {slide.badge.logo && (
                                        <div className="relative shrink-0
                                            w-6 h-6
                                            sm:w-7 sm:h-7
                                            lg:w-8 lg:h-8
                                            xl:w-10 xl:h-[49px]">
                                            <Image
                                                src={slide.badge.logo}
                                                alt={slide.badge.label}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    {/* Poppins 16px Regular من الـ Figma */}
                                    <span className="text-[#FAFAFA] font-normal font-[Poppins]
                                        text-xs sm:text-sm xl:text-base">
                                        {slide.badge.label}
                                    </span>
                                </div>

                                {/* Title — Inter SemiBold، tracking 0.04em من الـ Figma */}
                                <h2 className="text-[#FAFAFA] font-semibold font-[Inter] tracking-[0.04em]
                                    text-xl sm:text-2xl md:text-3xl lg:text-[36px] xl:text-[48px]
                                    leading-tight lg:leading-[44px] xl:leading-[60px]">
                                    {slide.title}
                                    <br />
                                    {slide.subtitle}
                                </h2>

                                {/* CTA — Poppins Medium + line تحته من الـ Figma */}
                                <Link
                                    href={`/products/${slide.productId}`}
                                    className="flex items-center gap-2 w-fit hover:opacity-70 transition-opacity"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[#FAFAFA] font-medium font-[Poppins]
            text-xs sm:text-sm xl:text-base leading-6">
                                            {slide.cta}
                                        </span>
                                        <span className="block h-px bg-[#FAFAFA] w-full" />
                                    </div>
                                    <ArrowRight
                                        className="text-[#FAFAFA] w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6"
                                        strokeWidth={1.5}
                                    />
                                </Link>
                            </div>

                            {/* Right: Product Image — نسبة من الـ slide */}
                            <div className="relative shrink-0 z-10 h-full w-1/2">
                                <Image
                                    src={slide.image}
                                    alt={slide.imageAlt}
                                    fill
                                    className="object-contain"
                                    priority={slide.id === 1}
                                />
                            </div>

                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />

            {/* Dots — مطابقة للـ Figma */}
            {/* inactive: 12×12 أبيض opacity 0.5 */}
            {/* active: 14×14 border أبيض 2px + داخله 10×10 #DB4444 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className="flex items-center justify-center transition-all duration-300"
                    >
                        {index === current ? (
                            <span className="flex items-center justify-center w-[14px] h-[14px] rounded-full border-2 border-white">
                                <span className="w-[10px] h-[10px] rounded-full bg-[#DB4444]" />
                            </span>
                        ) : (
                            <span className="w-3 h-3 rounded-full bg-white opacity-50" />
                        )}
                    </button>
                ))}
            </div>

        </Carousel>
    )
}