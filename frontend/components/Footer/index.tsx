import { Link } from '@/i18n/navigation'
import React from 'react'
function Footer() {
    return (
        <footer className="bg-black text-white py-10">
            <div className="container mx-auto px-6 md:px-10 lg:px-14">

                {/* شبكة الأعمدة */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

                    {/* Exclusive — يأخذ عمودين على التابلت */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-4">
                        <h3 className="text-xl font-bold">Exclusive</h3>
                        <p className="text-base font-medium">Subscribe</p>
                        <p className="text-sm text-gray-400">Get 10% off your first order</p>
                        <div className="flex border border-gray-600 max-w-xs">
                            <input
                                className="bg-transparent flex-1 min-w-0 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none"
                                type="email"
                                placeholder="Enter your email"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 border-l border-gray-600 text-gray-300 hover:text-white text-sm transition-colors"
                                aria-label="Subscribe"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">Support</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</li>
                            <li>exclusive@gmail.com</li>
                            <li>+88015-88888-9999</li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">Account</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">My Account</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Login / Register</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Cart</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Wishlist</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Shop</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Terms Of Use</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Download App */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">Download App</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">{"Women's Fashion"}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{"Men's Fashion"}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                        </ul>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Exclusive. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
