import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  try {
    const messages = {
      common: (await import(`../messages/${locale}/common.json`)).default,
      nav: (await import(`../messages/${locale}/nav.json`)).default,
      products: (await import(`../messages/${locale}/products.json`)).default,
      cart: (await import(`../messages/${locale}/cart.json`)).default,
      checkout: (await import(`../messages/${locale}/checkout.json`)).default,
      account: (await import(`../messages/${locale}/account.json`)).default,
      auth: (await import(`../messages/${locale}/auth.json`)).default,
      admin: (await import(`../messages/${locale}/admin.json`)).default,
      footer: (await import(`../messages/${locale}/footer.json`)).default,
      seo: (await import(`../messages/${locale}/seo.json`)).default,
      toasts: (await import(`../messages/${locale}/toasts.json`)).default,
    };
    return { locale, messages };
  } catch {
    return { locale, messages: {} };
  }
});
