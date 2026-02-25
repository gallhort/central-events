import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/connexion?callbackUrl=${nextUrl.pathname}`, req.url)
      );
    }

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
