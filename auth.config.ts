import type { NextAuthConfig } from "next-auth";

// Minimal auth config for Edge middleware - no Node.js dependencies
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/connexion",
    error: "/auth/connexion",
  },
  providers: [],
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
