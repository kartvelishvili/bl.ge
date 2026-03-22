import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;
  const url = nextUrl.clone();

  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/icon.svg") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/robots.txt") ||
    url.pathname.startsWith("/sitemap.xml") ||
    url.pathname.includes("png") ||
    url.pathname.includes("svg") ||
    url.pathname.includes("jpg") ||
    url.pathname.includes("mp4") ||
    url.pathname.includes("mov") ||
    url.pathname.includes("ico") ||
    url.pathname.includes("robots")
  ) {
    return NextResponse.next();
  }

  const locales = ["en", "ge", "ru"];
  const defaultLocale = "ge";

  const country = headers.get("cf-ipcountry") || "";
  const locale = country === "GE" || country === "" || country === "arari" ? defaultLocale : "en";

  if (!locales.some((loc) => url.pathname.startsWith(`/${loc}`))) {
    url.pathname = `/${locale}${url.pathname}`;
    const res = NextResponse.redirect(url);
    res.cookies.set("test", headers.get("cf-ipcountry") ?? "arari");
    return res;
  }

  const res = NextResponse.next();
  res.cookies.set("test", headers.get("cf-ipcountry") ?? "arari");
  return res;
}
