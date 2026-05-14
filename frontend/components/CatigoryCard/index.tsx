import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/types/api'

interface CategoryCardProps {
    category: Category;
    className?: string;
}

function CategoryCard({ category, className }: CategoryCardProps) {
    return (
        <Link href={`/products?category=${category._id}`}>
            <div className={`flex w-full flex-col items-center justify-center text-center h-36 border
             border-gray-300 rounded-lg rounded-[4px] hover:bg-[#DB4444] hover:text-white transition-all duration-200 ${className}`}>
                <span className='flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 overflow-hidden'>
                    <Image
                        src={category.photo}
                        alt={category.name}
                        width={56}
                        height={56}
                        className='w-14 h-14 object-contain'
                    />
                </span>
                <p className='pt-4 text-[1rem]'>{category.name}</p>
            </div>
        </Link>
    )
}

export default CategoryCard