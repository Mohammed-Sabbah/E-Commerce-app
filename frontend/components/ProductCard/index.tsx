import Image from 'next/image'
import React from 'react'
import { StarsComponent } from './StarsComponent'
import { EyeIcon, HeartIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/types/api';

interface ProductCardProps {
    product: Product;
    className?: string;
}

function ProductCard({ product, className }: ProductCardProps) {
    const discount = product.priceAfterDiscount
        ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
        : null;

    const brandName = typeof product.brand === "object" && product.brand !== null
        ? product.brand.name
        : product.brand;

    return (
        <div className={`${className}`}>
            <div className='h-63 relative group'>
                <img
                    src={product.coverImage}
                    alt={product.name}
                    className='w-full h-full object-cover'
                />
                <button className='absolute bottom-0 right-0 w-full bg-black text-white px-4 py-2 rounded-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'>
                    Add To Cart
                </button>

                {discount && (
                    <span className='discount-label px-3 py-1 rounded-sm absolute left-2.5 top-2.5 bg-[#DB4444] text-[0.6rem] text-white font-normal'>
                        -{discount}%
                    </span>
                )}

                <button className='bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-2.5 right-2.5 cursor-pointer flex items-center justify-center transition-all'>
                    <HeartIcon className="h-6 w-6 text-center translate-y-[1px]" />
                </button>
                <button className='bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-13.5 right-2.5 cursor-pointer flex items-center justify-center'>
                    <EyeIcon className="h-6 w-6 text-center translate-y-[1px]" />
                </button>
            </div>

            <div className='pt-3'>
                <h3 className='text-[1rem] font-[500]'>{product.name}</h3>
                <p className='text-[1rem] font-[500] space-x-3 py-2'>
                    <span className='text-[#DB4444]'>
                        ${product.priceAfterDiscount ?? product.price}
                    </span>
                    {product.priceAfterDiscount && (
                        <span className='line-through text-black opacity-50'>
                            ${product.price}
                        </span>
                    )}
                </p>
                <StarsComponent
                    rating={product.avgRatings}
                    size={16}
                    reviews={product.ratingsQuantity}
                />

                {product.colors.length > 0 && (
                    <div className='flex gap-2 items-center py-2 px-1'>
                        {product.colors.map((color, i) => (
                            <input
                                key={i}
                                type="radio"
                                name={`color-${product._id}`}
                                className='appearance-none w-5 h-5 rounded-full cursor-pointer checked:ring-2 checked:ring-black checked:ring-offset-2 checked:w-3 checked:h-3'
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard