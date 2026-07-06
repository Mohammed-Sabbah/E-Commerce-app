import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

const protectedRoutes = ["/wishlist", "/cart", "/checkout", "/account", "/admin"];
const authRoutes = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const response = handleI18n(request);

  if (!response.ok) return response;

  const pathname = response.headers.get("x-middleware-rewrite")
    ? new URL(response.headers.get("x-middleware-rewrite")!).pathname
    : request.nextUrl.pathname;

  const pathWithoutLocale = pathname.replace(/^\/(en|ar)(\/|$)/, "/$2") || "/";

  const token = request.cookies.get("token")?.value;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL(`/en${pathWithoutLocale}`, request.url));
  }

  if (token && authRoutes.some((r) => pathWithoutLocale === r)) {
    return NextResponse.redirect(new URL("/en/", request.url));
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
