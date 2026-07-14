import { describe, expect, it } from "vitest";
import { getAuthRedirect, splitLocalePath } from "./authRedirect";

describe("auth redirects", () => {
  it("normalizes localized paths without adding a double slash", () => {
    expect(splitLocalePath("/ar/admin")).toEqual({
      locale: "ar",
      pathWithoutLocale: "/admin",
    });
    expect(splitLocalePath("/en/login")).toEqual({
      locale: "en",
      pathWithoutLocale: "/login",
    });
  });

  it("redirects logged-out users from protected localized routes to localized login", () => {
    expect(getAuthRedirect({ pathname: "/ar/admin", hasToken: false })).toEqual({
      redirectPath: "/ar/login",
    });
    expect(getAuthRedirect({ pathname: "/en/cart", hasToken: false })).toEqual({
      redirectPath: "/en/login",
    });
  });

  it("redirects logged-in users away from localized auth routes", () => {
    expect(getAuthRedirect({ pathname: "/ar/login", hasToken: true })).toEqual({
      redirectPath: "/ar/",
    });
  });
});
