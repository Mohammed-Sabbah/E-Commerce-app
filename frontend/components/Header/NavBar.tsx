"use client";

import Container from '../Container'
import Link from 'next/link'
import SearchInput from '../SearchInput'
import UserMenu from "../UserMenu";
import HeaderHeartButton from './HeaderHeartButton';
import HeaderCartButton from './HeaderCartButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Sign Up", href: "/register" },
];

function NavLink({ href, label, pathname, onClick }: {
    href: string;
    label: string;
    pathname: string;
    onClick?: () => void;
}) {
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block text-sm py-2 px-2 rounded-md transition
                hover:bg-gray-50 hover:text-red-500
                ${isActive ? "font-semibold bg-gray-50" : ""}`}
        >
            {label}
        </Link>
    );
}

function NavBar({ token, categoriesSlot }: {
    token: string | undefined;
    categoriesSlot: ReactNode;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openedAtPath, setOpenedAtPath] = useState("");
    const pathname = usePathname();

    const isMenuOpen = menuOpen && pathname === openedAtPath;

    const toggleMenu = useCallback(() => {
        setMenuOpen(prev => {
            if (!prev) setOpenedAtPath(pathname);
            return !prev;
        });
    }, [pathname]);

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    return (
        <nav className="bg-white text-black">
            <Container className="flex items-center justify-between py-4 px-3">
                <Link href="/" onClick={closeMenu} className="text-2xl font-bold shrink-0">
                    Exclusive
                </Link>

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

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <SearchInput />
                    </div>
                    <HeaderHeartButton />
                    <HeaderCartButton />
                    {token && <UserMenu />}

                    <button
                        className="lg:hidden flex items-center justify-center p-1"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {isMenuOpen
                            ? <XMarkIcon className="w-6 h-6" />
                            : <Bars3Icon className="w-6 h-6" />
                        }
                    </button>
                </div>
            </Container>

            <div
                id="mobile-menu"
                role="dialog"
                aria-label="Navigation menu"
                className={`lg:hidden border-t border-gray-100 bg-white
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
            >
                <div className="px-4 py-4 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
                    <div className="sm:hidden">
                        <SearchInput />
                    </div>

                    <ul className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <NavLink
                                    href={link.href}
                                    label={link.label}
                                    pathname={pathname}
                                    onClick={closeMenu}
                                />
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-gray-200" />

                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Categories
                    </p>

                    {categoriesSlot}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;