import React from 'react'

function Container({ children ,className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`max-w-7xl mx-auto px-6 w-full ${className ?? ''}`}>
            {children}
        </div>
    )
}

export default Container