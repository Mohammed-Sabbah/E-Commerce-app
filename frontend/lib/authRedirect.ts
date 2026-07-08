const protectedRoutes = ["/wishlist", "/cart", "/checkout", "/account", "/admin"];
const authRoutes = ["/login", "/register"];
const locales = ["en", "ar"] as const;

export type AppLocale = (typeof locales)[number];

type AuthRedirectInput = {
  pathname: string;
  hasToken: boolean;
  defaultLocale?: AppLocale;
};

type AuthRedirectResult = {
  redirectPath: string | null;
};

export function splitLocalePath(
  pathname: string,
  defaultLocale: AppLocale = "en"
): { locale: AppLocale; pathWithoutLocale: string } {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];
  const hasLocale = locales.includes(first as AppLocale);
  const locale = hasLocale ? (first as AppLocale) : defaultLocale;
  const rest = hasLocale ? parts.slice(1) : parts;
  const pathWithoutLocale = rest.length ? `/${rest.join("/")}` : "/";

  return { locale, pathWithoutLocale };
}

export function getAuthRedirect({
  pathname,
  hasToken,
  defaultLocale = "en",
}: AuthRedirectInput): AuthRedirectResult {
  const { locale, pathWithoutLocale } = splitLocalePath(pathname, defaultLocale);

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.includes(pathWithoutLocale);

  if (!hasToken && isProtectedRoute) {
    return { redirectPath: `/${locale}/login` };
  }

  if (hasToken && isAuthRoute) {
    return { redirectPath: `/${locale}/` };
  }

  return { redirectPath: null };
}
