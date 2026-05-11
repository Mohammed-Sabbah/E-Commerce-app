"use client";

import Container from '../Container'
import Link from 'next/link'
import SearchInput from '../SearchInput'
import UserMenu from "../UserMenu";
import HeaderHeartButton from './HeaderHeartButton';
import HeaderCartButton from './HeaderCartButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CollapsibleTree } from '../CollapsibleTree'; // ← أضف هاد

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Sign Up", href: "/register" },
];

function NavBar({ token }: { token: string | undefined }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="bg-white text-black">
            <Container className="flex items-center justify-between py-4 px-3">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold shrink-0">
                    Exclusive
                </Link>

                {/* Desktop Links */}
                <ul className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`text-sm transition-all duration-200 hover:text-red-500 pb-0.5
                                    ${pathname === link.href ? "border-b border-black font-medium" : ""}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <SearchInput />
                    </div>
                    <HeaderHeartButton />
                    <HeaderCartButton />
                    {token && <UserMenu />}

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden flex items-center justify-center"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen
                            ? <XMarkIcon className="w-6 h-6" />
                            : <Bars3Icon className="w-6 h-6" />
                        }
                    </button>
                </div>
            </Container>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                    {/* Search on mobile */}
                    <div className="sm:hidden">
                        <SearchInput />
                    </div>

                    {/* Nav Links */}
                    <ul className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`block text-sm py-1 transition hover:text-red-500
                                        ${pathname === link.href ? "font-semibold" : ""}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Divider */}
                    <div className="border-t border-gray-200" />

                    {/* Categories */}
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
                    <CollapsibleTree />
                </div>
            )}
        </nav>
    );
}

export default NavBar;