import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;

    if (path.startsWith("/dashboard/sppg") && role !== "SPPG") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/dashboard/sekolah") && role !== "SEKOLAH") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/dashboard/pemerintah") && role !== "PEMERINTAH") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path === "/dashboard" || path === "/dashboard/") {
      switch (role) {
        case "SPPG":
          return NextResponse.redirect(new URL("/dashboard/sppg", req.url));
        case "SEKOLAH":
          return NextResponse.redirect(new URL("/dashboard/sekolah", req.url));
        case "PEMERINTAH":
          return NextResponse.redirect(new URL("/dashboard/pemerintah", req.url));
        default:
          return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
