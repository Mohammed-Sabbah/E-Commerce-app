import React from 'react'

function Timer() {
    return (
        <div className='flex justify-center items-center space-x-4'>
            <TimerItem number={11} title="Days" />
            <Colomns/>
            <TimerItem number={12} title="Hours" />
            <Colomns/>
            <TimerItem number={30} title="Minutes" />
            <Colomns/>
            <TimerItem number={33} title="Seconds" />

        </div>
    )
}

export default Timer

export function TimerItem({number, title}:{number: number, title: string}){
    return (
        <h3 className='text-4xl font-[700] relative'>
            <span className='text-[0.7rem] font-[500] font-poppins absolute top-[-50%] left-0'>{title}</span>
            {number}
        </h3>
    )
}

export function Colomns (){
    return(
        <span className='text-[#E07575] text-3xl font-[400] t'>:</span>
    )
}