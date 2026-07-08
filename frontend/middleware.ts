import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getAuthRedirect } from "./lib/authRedirect";

const handleI18n = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = handleI18n(request);

  if (!response.ok) return response;

  const pathname = response.headers.get("x-middleware-rewrite")
    ? new URL(response.headers.get("x-middleware-rewrite")!).pathname
    : request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value;
  const { redirectPath } = getAuthRedirect({
    pathname,
    hasToken: Boolean(token),
    defaultLocale: routing.defaultLocale,
  });

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
