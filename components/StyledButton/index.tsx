import React from 'react'

function index({title, ClassName}:{title:string, ClassName?: string}) {
    return (
        <button className={`bg-[#DB4444] text-white px-12 py-4 rounded-[4px] ${ClassName}`}>{title} </button>

    )
}

export default index