import { Product } from '@/types/api'
import React from 'react'
import ProductGallery from './ProductGallery'
import ProductOptions from './ProductOptions'
import ProductActions from './ProductActions'
import { StarsComponent } from '../ProductCard/StarsComponent'
import { ArrowPathIcon, TruckIcon } from '@heroicons/react/24/outline'

function ProductDetailesComponent({ product }: { product: Product }) {

    const inStock = product.quantity > 0

    const breadcrumbs = [
        { label: 'Account', href: '/account' },
        { label: product.category.name, href: `/category/${product.category.name}` },
        { label: product.name },
    ]

    return (
        <main className="max-w-6xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
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
                    <div className=''>
                        <h1 className="text-2xl font-inter font-semibold text-gray-900">{product.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <StarsComponent rating={product.avgRatings}/>
                            <span className="text-sm text-gray-500">({product.ratingsQuantity} Reviews)</span>
                            <span className="w-px h-4 bg-gray-300" />
                            <span className={`text-sm font-medium ${inStock ? 'text-green-500' : 'text-red-500'}`}>
                                {inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <p className="text-3xl font-inter font-[400] mt-3">${product.price.toFixed(2)}</p>
                        <p className="text-black font-[400] text-sm mt-3 leading-relaxed">{product.description}</p>
                    </div>

                    <hr className="border-gray-200" />

                    <ProductOptions colors={product.colors} sizes={[]} />
                    <ProductActions productId={product._id} inStock={inStock} />

                    {/* Delivery info */}
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                        <div className="flex items-start gap-4 p-4">
                            <span className="text-2xl">
                                <TruckIcon className='h-7 w-7' strokeWidth={1} />
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                                <p className="text-xs text-gray-500 mt-0.5">Enter your postal code for Delivery Availability</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4">
                            <span className="text-2xl">
                                <ArrowPathIcon  className="w-6 h-6"  strokeWidth={1}/>
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Return Delivery</p>
                                <p className="text-xs text-gray-500 mt-0.5">Free 30 Days Delivery Returns. Details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProductDetailesComponent