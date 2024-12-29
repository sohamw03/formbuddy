import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if the request is for the API
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Exclude auth endpoints from protection
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    const token = await getToken({ req: request });
    if (!token) {
      return new NextResponse(JSON.stringify({ success: false, message: "Authentication required" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
