'use client'

import { useEffect, useState } from "react"

const TARGET_DATE = new Date(Date.now() +
    11 * 86400000 +
    12 * 3600000 +
    30 * 60000 +
    33 * 1000
)

function Timer() {
    const [time, setTime] = useState({ days: 11, hours: 12, minutes: 30, seconds: 33 })

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.max(0, TARGET_DATE.getTime() - Date.now())

            setTime({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className='flex justify-center items-center space-x-4'>
            <TimerItem number={time.days} title="Days" />
            <Columns />
            <TimerItem number={time.hours} title="Hours" />
            <Columns />
            <TimerItem number={time.minutes} title="Minutes" />
            <Columns />
            <TimerItem number={time.seconds} title="Seconds" />
        </div>
    )
}

export default Timer

export function TimerItem({ number, title }: { number: number; title: string }) {
    return (
        <h3 className='text-4xl font-[700] relative'>
            <span className='text-[0.7rem] font-[500] font-poppins absolute top-[-50%] left-0'>{title}</span>
            {String(number).padStart(2, "0")}
        </h3>
    )
}

export function Columns() {
    return (
        <span className='text-[#E07575] text-3xl font-[400]'>:</span>
    )
}