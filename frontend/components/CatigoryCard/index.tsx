import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import React from 'react'

function index() {
    return (
        <div className='flex w-full flex-col items-center justify-center text-center h-36 border
         border-gray-300 rounded-lg rounded-[4px] hover:bg-[#DB4444] hover:text-white transition-all duration-200'>
            <i className='flex justify-center'>
                <DevicePhoneMobileIcon className='w-14 h-14' />
                {/* <ComputerDesktopIcon/> */}
                {/* <CameraIcon/> */}
                {/* <Headphones/> */}
                {/* <GamepadIcon/> */}
            </i>
            <p className='pt-4 text-[1rem]'>Smart Phones</p>
        </div>
    )
}

export default index
