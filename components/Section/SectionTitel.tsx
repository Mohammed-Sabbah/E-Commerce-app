import React from 'react'

function SectionTitle({ title, Category, children }: { title: string, Category: string, children?: React.ReactNode }) {
    return (
        <>
            <div>
                <p className='text-[#DB4444] text-[1rem] font-bold flex items-center justify-start'><span className="w-5 h-10 mr-3.5 rounded-[4px] bg-[#DB4444] inline-block"></span> {Category}</p>
                <h2 className='text-4xl pt-6 font-[600]'>{title}</h2>
            </div>
            {children}
        </>
    )
}

export default SectionTitle