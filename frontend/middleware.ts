// frontend/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
    '/wishlist',
    '/cart',
    '/checkout',
    '/account',
    '/admin',   // ← إضافة
];

const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // 1. غير مسجل دخول يحاول يفتح صفحة محمية → redirect للـ login
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. مسجل دخول يحاول يفتح login/register → redirect للـ home
    if (token && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/wishlist',
        '/wishlist/:path*',
        '/cart',
        '/cart/:path*',
        '/checkout',
        '/checkout/:path*',
        '/account',
        '/account/:path*',
        '/admin',          // ← إضافة
        '/admin/:path*',   // ← إضافة
        '/login',
        '/register',
    ],
};
