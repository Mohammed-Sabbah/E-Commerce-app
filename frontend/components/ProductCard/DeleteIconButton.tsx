'use client'

import { useWishlist } from '@/hooks/useWishlist'
import { TrashIcon } from '@heroicons/react/24/outline'

function DeleteIconButton({ productId }: { productId: string }) {
    const { removeFromWishlist } = useWishlist()
    return (
        <button onClick={() => { removeFromWishlist(productId) }} className='bg-white/80 w-9 h-9 rounded-full absolute top-2.5 right-2.5 flex items-center justify-center cursor-pointer'>
            <TrashIcon className="h-6 w-6 text-center translate-y-[1px]" />
        </button>
    )
}

export default DeleteIconButton