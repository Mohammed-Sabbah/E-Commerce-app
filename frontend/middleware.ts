// frontend/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// المسارات المحمية (التي تتطلب تسجيل دخول)
const protectedRoutes = [
    '/wishlist',
    '/cart',
    '/checkout',
    '/account',
    // ملاحظة: /orders و /dashboard أُزيلا لأن الصفحات الفعلية على /account/orders
    // إذا أضفت Admin Dashboard مستقبلاً أعد إضافة /dashboard هنا
];

// مسارات الضيوف (التي لا يمكن دخولها إذا كنت مسجل دخول)
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
        '/login',
        '/register',
    ],
};