'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
    images: string[]
    productName: string
}

export default function ProductGallery({ images, productName }: Props) {
    const [selected, setSelected] = useState(0)

    // فلتر الصور الفاضية
    const validImages = images.filter((img) => img && img.trim() !== '')

    if (validImages.length === 0) return null

        console.log("coverImage:", images)  // ← هون


    return (
        <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
                {validImages.map((img, i) => (
                    
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${selected === i ? 'border-red-500' : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${productName} ${i + 1}`}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    </button>
                ))}
            </div>

            {/* Main image */}
            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden aspect-square relative">
                <Image
                    src={validImages[selected]}
                    alt={productName}
                    fill
                    className="object-contain p-6"
                    priority
                />
            </div>
        </div>
    )
}