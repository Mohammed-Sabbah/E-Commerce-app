'use client';

import { useState } from 'react';
import { Product, PopulatedRef } from '@/types/api';
import ProductGallery from './ProductGallery';
import ProductOptions from './ProductOptions';
import ProductActions from './ProductActions';
import { StarsComponent } from '../ProductCard/StarsComponent';
import { ArrowPathIcon, TruckIcon } from '@heroicons/react/24/outline';
import ProductReviews from './ProductReviews';

export default function ProductDetailesComponent({ product }: { product: Product }) {
    const inStock = product.quantity > 0;

    const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] ?? null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const catName = typeof product.category === 'string' ? product.category : (product.category as PopulatedRef).name;
    const breadcrumbs = [
        { label: 'Account', href: '/account' },
        { label: catName, href: `/category/${catName}` },
        { label: product.name },
    ];

    return (
        <main className="max-w-6xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
                {breadcrumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-2">
                        {crumb.href ? (
                            <a href={crumb.href} className="hover:text-gray-800 transition-colors">
                                {crumb.label}
                            </a>
                        ) : (
                            <span className="text-gray-800">{crumb.label}</span>
                        )}
                        {i < breadcrumbs.length - 1 && <span>/</span>}
                    </span>
                ))}
            </nav>

            {/* Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                {/* Left: Gallery */}
                <ProductGallery images={product.images} productName={product.name} />

                {/* Right: Info + Options + Actions */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-inter font-semibold text-gray-900">{product.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <StarsComponent rating={product.avgRatings} />
                            <span className="text-sm text-gray-500">({product.ratingsQuantity} Reviews)</span>
                            <span className="w-px h-4 bg-gray-300" />
                            <span className={`text-sm font-medium ${inStock ? 'text-green-500' : 'text-red-500'}`}>
                                {inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* السعر مع الخصم */}
                        <div className="flex items-center gap-3 mt-3">
                            <p className="text-3xl font-inter font-[400] text-black">
                                ${(product.priceAfterDiscount ?? product.price).toFixed(2)}
                            </p>
                            {product.priceAfterDiscount && product.priceAfterDiscount < product.price && (
                                <p className="text-xl font-inter font-[400] line-through text-gray-400">
                                    ${product.price.toFixed(2)}
                                </p>
                            )}
                        </div>

                        <p className="text-black font-[400] text-sm mt-3 leading-relaxed">{product.description}</p>
                    </div>

                    <hr className="border-gray-200" />

                    <ProductOptions
                        colors={product.colors}
                        sizes={[]}
                        selectedColor={selectedColor}
                        selectedSize={selectedSize}
                        onColorChange={setSelectedColor}
                        onSizeChange={setSelectedSize}
                    />

                    <ProductActions
                        product={{
                            _id: product._id,
                            name: product.name,
                            price: product.priceAfterDiscount ?? product.price,
                            image: product.images?.[0] ?? '',
                        }}
                        inStock={inStock}
                        selectedColor={selectedColor}
                    />

                    {/* Delivery info */}
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                        <div className="flex items-center gap-4 p-4">
                            <TruckIcon className="h-9 w-9 flex-shrink-0" strokeWidth={1} />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                                <p className="text-xs text-gray-500 mt-0.5">Enter your postal code for Delivery Availability</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4">
                            <ArrowPathIcon className="h-9 w-9 flex-shrink-0" strokeWidth={1} />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Return Delivery</p>
                                <p className="text-xs text-gray-500 mt-0.5">Free 30 Days Delivery Returns. Details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductReviews productId={product._id} />
        </main>
    );
}