import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <footer className="bg-black text-white py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className='space-y-5'>
                        <h3 className="text-xl font-bold mb-4 ">Exclusive</h3>
                        <p className="text-md">Subscribe</p>
                        <p className="text-sm">Get 10% off your first order</p>
                        <form>
                            <input className='border-2 border-white p-3' type="email" placeholder='Enter your Email'/>
                        </form>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-5 text-sm">
                            <li className='max-w-40'>111 Bijoy sarani, Dhaka,  DH 1515, Bangladesh.</li>
                            <li className='max-w-40'>exclusive@gmail.com</li>
                            <li className='max-w-40'>+88015-88888-9999</li>
                            
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Account</h3>
                        <ul className="space-y-5 text-sm">
                            <li><Link href="/" className="hover:text-gray-300">My Account</Link></li>
                            <li><Link href="/" className="hover:text-gray-300">Login / Register</Link></li>
                            <li><Link href="/" className="hover:text-gray-300">Cart</Link></li>
                            <li><Link href="/" className="hover:text-gray-300">Wishlist</Link></li>
                            <li><Link href="/" className="hover:text-gray-300">shop</Link></li>
                            
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-5 text-sm">
                            <li><Link href="/" className="hover:text-gray-300">Privacy Policy</Link></li>
                            <li><Link href="/" className="hover:text-gray-300">Terms Of Use</Link></li>
                            <li><Link href="/" className="hover:text-gray-300">FAQ</Link></li>
                            <li><Link href="/" className="hover:text-gray-300">Contact</Link></li>
                          
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Download App</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-gray-300">Women's Fashion</a></li>
                            <li><a href="#" className="hover:text-gray-300">Men's Fashion</a></li>
                            <li><a href="#" className="hover:text-gray-300">Electronics</a></li>
                            <li><a href="#" className="hover:text-gray-300">Accessories</a></li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                    &copy; {new Date().getFullYear()} Exclusive. All rights reserved.
                </div>

            </div>

        </footer >
    )
}

export default Footer