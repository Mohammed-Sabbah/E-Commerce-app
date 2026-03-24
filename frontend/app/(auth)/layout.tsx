import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen bg-white">
            <div className="flex min-h-screen gap-0 pr-6 py-10 lg:pr-10">
                <div className="flex flex-7/12 items-center justify-center">
                    <div className="w-full">
                        <img
                            src="/images/authPageCover.jpg"
                            alt="Cover Image"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>

                <div className="flex flex-5/12 items-center justify-center py-10 lg:py-0">
                    {children}
                </div>
            </div>
        </section>
    )
}

export default AuthLayout
