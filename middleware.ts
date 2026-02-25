export const runtime = "nodejs";

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  // Protect all dashboard routes
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/connexion?callbackUrl=${nextUrl.pathname}`, req.url)
      );
    }

    // Role-based routing
    const role = session.user?.role;
    if (
      nextUrl.pathname.startsWith("/dashboard/organisateur") &&
      role !== "ORGANISATEUR" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard/prestataire", req.url));
    }
    if (
      nextUrl.pathname.startsWith("/dashboard/prestataire") &&
      role !== "PRESTATAIRE" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard/organisateur", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
