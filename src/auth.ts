import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Keycloak from "next-auth/providers/keycloak";

const platformApi = (
  process.env.PLATFORM_API_URL || "http://127.0.0.1:8002"
).replace("://localhost", "://127.0.0.1");

async function userFromPlatformToken(accessToken: string) {
  const response = await fetch(`${platformApi}/v1/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = await response.json();
  if (!user?.id) return null;
  return {
    id: user.id as string,
    email: user.email as string,
    name: (user.name as string) || "User",
    accessToken,
  };
}

async function platformTokenStatus(accessToken: string) {
  try {
    const response = await fetch(`${platformApi}/v1/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (response.status === 401 || response.status === 403) return "invalid" as const;
    return "keep" as const;
  } catch {
    return "keep" as const;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    // The bridge exchanges a one-time platform handoff before using this provider.
    Credentials({
      id: "platform-token",
      name: "Platform token",
      credentials: { accessToken: { label: "Token", type: "text" } },
      async authorize(credentials) {
        const accessToken = String(credentials?.accessToken || "").trim();
        if (!accessToken) return null;
        return userFromPlatformToken(accessToken);
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }
      if (account?.access_token) token.accessToken = account.access_token;
      const accessToken = token.accessToken as string | undefined;
      if (!user && accessToken && (await platformTokenStatus(accessToken)) === "invalid") {
        return null;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (session.user) session.user.id = (token.userId ?? token.sub) as string;
      return session;
    },
  },
});
