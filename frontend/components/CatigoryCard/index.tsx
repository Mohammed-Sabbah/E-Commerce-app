import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/types/api'

interface CategoryCardProps {
    category: Category;
    className?: string;
}

function CategoryCard({ category, className }: CategoryCardProps) {
    return (
        // <Link href={`/products?category=${category._id}`}>
        //     {/* <div className={`flex w-full flex-col items-center justify-center text-center h-36 border
        //      border-gray-300 rounded-lg hover:bg-[#DB4444] hover:text-white transition-all duration-200 ${className}`}>

        //         <div className='relative w-24 h-24 rounded-full overflow-hidden bg-gray-100'>
        //             <Image
        //                 src={category.photo}
        //                 alt={category.name}
        //                 fill
        //                 className='object-cover'
        //             />
        //         </div>

        //         <p className='pt-4 text-[1rem]'>{category.name}</p>
        //     </div> */}


        //     <div className={`relative w-full h-36 overflow-hidden rounded-lg border border-gray-300 group cursor-pointer ${className}`}>
        //         <Image
        //             src={category.photo}
        //             alt={category.name}
        //             fill
        //             className='object-cover transition-transform duration-300 group-hover:scale-105'
        //         />

        //         <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 to-transparent' />
        //         <p className='absolute bottom-3 left-0 right-0 text-center text-white font-medium text-sm'>
        //             {category.name}
        //         </p>
        //     </div>

        // </Link>



        <Link href={`/products?category=${category._id}`}>
            <div className={`relative w-full h-36 overflow-hidden rounded-lg border border-gray-300 group cursor-pointer ${className}`}>
                <Image
                    src={category.photo}
                    alt={category.name}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                />

                {/* الطبقة العادية - أسود */}
                <div className='absolute bottom-0 left-0 right-0 h-16 
            bg-gradient-to-t from-black/70 to-transparent
            opacity-100 group-hover:opacity-0
            transition-opacity duration-300' />

                {/* الطبقة عند الهوفر - أحمر */}
                <div className='absolute inset-0
            bg-gradient-to-t from-[#DB4444]/70 to-[#DB4444]/10
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300' />

                <p className='absolute bottom-3 left-0 right-0 text-center text-white font-medium text-sm z-10'
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    {category.name}
                </p>
            </div>
        </Link>
    )
}

export default CategoryCard