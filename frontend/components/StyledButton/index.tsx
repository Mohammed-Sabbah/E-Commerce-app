import { cn } from '@/lib/utils'
import React from 'react'

function StyledButton({title, ClassName, type}:{title:string, ClassName?: string, type?:"button"|"reset"|"submit"}) {
    return (
        <button type={type} className={cn(`bg-[#DB4444] text-white px-12 py-4 rounded-[4px]` , ClassName)}>{title} </button>

    )
}

export default StyledButton