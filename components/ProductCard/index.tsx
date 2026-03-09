import Image from 'next/image'
import React from 'react'
import { StarsComponent } from './StarsComponent'
import { EyeIcon, HeartIcon } from '@heroicons/react/24/outline';

function ProductCard({className}:{className?:string}) {
    return (
        <div className={`${className}`}>
            <div className='h-63 relative group'>
                <img src="/images/photo-1505740420928-5e560c06d30e.jpeg" alt="description" className='w-full h-full object-cover' />
                <button className='absolute bottom-0 right-0 w-full bg-black text-white px-4 py-2 rounded-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'>Add To Cart</button>
                <span className='discount-label px-3 py-1 rounded-sm absolute left-2.5 top-2.5 bg-[#DB4444] text-[0.6rem] text-white font-normal'>-35%</span>
                <button className='bg-white/80 w-9 h-9 rounded-full absolute top-2.5 right-2.5 cursor-pointer flex items-center justify-center '>
                    <HeartIcon className="h-6 w-6 text-center translate-y-[1px]" />
                </button>
                <button className=' bg-white/80  w-9 h-9 rounded-full absolute top-13.5 right-2.5 cursor-pointer flex items-center justify-center '>
                    <EyeIcon className="h-6 w-6 text-center translate-y-[1px]" />
                </button>

            </div>
            <div className='pt-3 '>
                <h3 className='text-[1rem] font-[500]'>HAVIT HV-G92 Gamepad</h3>
                <p className='text-[1rem] font-[500] space-x-3 py-2'><span className='text-[#DB4444]'>$120</span><span className='line-through text-black opacity-50'>$160</span></p>
                <StarsComponent rating={4.3} size={16} reviews={100} />

            </div>

        </div>
    )
}

export default ProductCard