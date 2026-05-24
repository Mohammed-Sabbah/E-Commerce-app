import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen bg-white">
            <div className="flex min-h-screen flex-col lg:flex-row">

                {/* Image */}
                <div className="hidden lg:flex lg:w-7/12 items-center justify-center p-6">
                    <img
                        src="/images/authPageCover.jpg"
                        alt="Cover Image"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Form */}
                <div className="flex w-full lg:w-5/12 items-center justify-center px-4 py-10">
                    {children}
                </div>

            </div>
        </section>
    );
}

export default AuthLayout
