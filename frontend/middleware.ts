import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// المسارات المحمية (التي تتطلب تسجيل دخول)
const protectedRoutes = ['/', '/profile', '/orders', '/dashboard'];
// مسارات الضيوف (التي لا يمكن دخولها إذا كنت مسجل دخول)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // 1. إذا كان المستخدم غير مسجل دخول ويحاول دخول صفحة محمية
    // أضفنا شرط إضافي للتأكد أنه ليس في صفحة login بالفعل لتجنب الـ Loop
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!token && isProtectedRoute) {
        // استثناء: إذا كان المسار هو login أو register لا تفعل شيء
        if (authRoutes.includes(pathname)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. إذا كان المستخدم مسجل دخول ويحاول دخول صفحات الـ Auth (login/register)
    if (token && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// الـ Matcher مهم جداً لاستثناء ملفات النظام والصور
export const config = {
    matcher: [
        /*
         * مطابقة كل المسارات ما عدا:
         * 1. api (مسارات الـ API)
         * 2. _next/static (الملفات الاستاتيكية)
         * 3. _next/image (صور Next.js المحسنة)
         * 4. favicon.ico (أيقونة الموقع)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};