import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function embedHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);
  headers.set("x-social-embed", "1");
  return headers;
}

function cameFromPlatform(request: NextRequest): boolean {
  const referer = request.headers.get("referer");
  if (!referer) return false;

  try {
    return new URL(referer).origin === new URL(
      process.env.PLATFORM_FRONTEND_URL || "http://localhost:3000",
    ).origin;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const embedParam = request.nextUrl.searchParams.get("embed") === "1";
  const embedCookie = request.cookies.get("social-embed")?.value === "1";

  if (embedParam || embedCookie) {
    if (!embedParam && embedCookie) {
      const url = request.nextUrl.clone();
      url.searchParams.set("embed", "1");
      return NextResponse.redirect(url);
    }

    const response = NextResponse.next({ request: { headers: embedHeaders(request) } });
    response.cookies.set("social-embed", "1", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  if (request.headers.get("sec-fetch-dest") === "document" && !cameFromPlatform(request)) {
    const response = NextResponse.next();
    response.cookies.delete("social-embed");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
