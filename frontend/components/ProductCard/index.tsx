import { StarsComponent } from './StarsComponent'
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import HearIconButton from './HeartIconButton';
import DeleteIconButton from './DeleteIconButton';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';
import Image from 'next/image';

export type ProductCardData = {
    _id: string;
    name: string;
    price: number;
    priceAfterDiscount?: number;
    coverImage?: string;
    brand?: { name: string } | string | null;
    avgRatings: number;
    ratingsQuantity?: number;
    colors?: string[];
};

interface ProductCardProps {
    product: ProductCardData;
    className?: string;
    variant?: "default" | "wishlist";
}

function ProductCard({ product, className, variant = "default" }: ProductCardProps) {

    const config = {
        default: {
            showRating: true,
            showEye: true,
            showWishlist: true,
            showDelete: false,
            showAddToCart: false,
        },
        wishlist: {
            showRating: false,
            showEye: true,
            showWishlist: false,
            showDelete: true,
            showAddToCart: true,
        },
    };

    const current = config[variant];

    const discount = product?.priceAfterDiscount && product.priceAfterDiscount < product.price
        ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
        : null;

    const brandName = typeof product.brand === "object" && product.brand !== null
        ? product.brand.name
        : product.brand;

    return (
        <div className={`${className}`}>
            <div className='h-63 relative group'>
                {product.coverImage && (
                    <Image
                        src={product.coverImage}
                        alt={product.name}
                        fill
                        className='object-contain'
                        sizes="(max-width: 768px) 100vw, 25vw"
                    />
                )}

                {/* Add To Cart */}
                <AddToCartButton product={product} showAddToCart={current.showAddToCart} />

                {discount && (
                    <span className='discount-label px-3 py-1 rounded-sm absolute left-2.5 top-2.5 bg-[#DB4444] text-[0.6rem] text-white font-normal'>
                        -{discount}%
                    </span>
                )}

                {/* Wishlist / Delete */}
                {current.showWishlist && (
                    <HearIconButton productId={product._id} />
                )}

                {current.showDelete && (
                    <DeleteIconButton productId={product._id} />
                )}

                {/* Eye */}
                {current.showEye && (
                    <Link href={`/products/${product._id}`} className='bg-white/80 hover:bg-white w-9 h-9 rounded-full absolute top-13.5 right-2.5 cursor-pointer flex items-center justify-center'>
                        <EyeIcon className="h-6 w-6 text-center translate-y-[1px]" />
                    </Link>
                )}
            </div>

            <div className='pt-3'>
                <h3 className='text-[1rem] font-[500]'>{product.name}</h3>

                <p className='text-[1rem] font-[500] space-x-3 py-2'>
                    <span className='text-[#DB4444]'>
                        ${product.priceAfterDiscount ?? product.price}
                    </span>

                    {product.priceAfterDiscount && product.priceAfterDiscount < product.price && (
                        <span className='line-through text-black opacity-50'>
                            ${product.price}
                        </span>
                    )}
                </p>

                {current.showRating && (
                    <StarsComponent
                        rating={product.avgRatings}
                        size={16}
                        reviews={product.ratingsQuantity ?? 0}
                    />
                )}
                {/* Colors */}
                {/* {product.colors?.length ? (
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
                ) : null} */}
            </div>
        </div>
    )
}

export default ProductCard