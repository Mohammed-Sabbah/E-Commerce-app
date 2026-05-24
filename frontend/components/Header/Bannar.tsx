"use client";
import { useState } from "react";
import Container from "../Container";

export function Banner() {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div className="bg-black text-white">
            <Container className="relative flex items-center justify-center py-3 px-4">
                <p className="text-xs sm:text-sm text-center pr-16 sm:pr-0">
                    Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}

                    <a href="/sale"
                        className="underline font-semibold hover:text-gray-300 transition"
                    >
                        Shop Now
                    </a>
                </p>

                <div className="absolute right-4 flex items-center gap-3">
                    <select
                        className="bg-transparent text-xs sm:text-sm text-gray-300 
                                   hover:text-white transition cursor-pointer 
                                   appearance-none border-none outline-none"
                        defaultValue="en"
                        aria-label="Select language"
                    >
                        <option value="en" className="bg-black">English</option>
                        <option value="ar" className="bg-black">العربية</option>
                    </select>

                    <button
                        onClick={() => setVisible(false)}
                        className="text-gray-400 hover:text-white transition text-lg leading-none"
                        aria-label="Close banner"
                    >
                        ×
                    </button>
                </div>
            </Container>
        </div >
    );
}