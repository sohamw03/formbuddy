import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, Session as NextAuthSession } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
interface Session extends NextAuthSession {
  error?: string;
}

const scopes = [
  //
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.appdata",
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  // Providers array will be configured in the next steps
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { scope: scopes.join(" "), access_type: "offline", prompt: "consent" } },
    }),
  ],
  pages: {
    signIn: "/", // The signIn page
    signOut: "/", // The signOut page
    error: "/", // Error code passed in query string as ?error=
    newUser: "/", // If set, new users will be directed here on first sign in
  },
  callbacks: {
    signIn: async ({ account, profile, credentials }) => {
      const myprofile = profile as any;

      if (account?.provider === "google" && myprofile.email_verified) {
        // console.log({ account, profile });
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, account, profile }) => {
      // console.log("jwt callback", { token, user, account, profile, trigger });
      if (account) {
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at;
        token.refreshToken = account.refresh_token;
      } else if (Date.now() < (token.expiresAt as number) * 1000) {
        // Subsequent logins, but the `access_token` is still valid
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refreshToken) throw new TypeError("Missing refresh_token");

        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          token.accessToken = newTokens.access_token;
          token.expiresAt = Math.floor(Date.now() / 1000 + newTokens.expires_in);
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token) token.refreshToken = newTokens.refresh_token;
        } catch (error) {
          console.error("Error refreshing access_token", error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError";
        }
      }
      if (account) {
        // Add custom claims to the JWT. These will be saved in the JWT.
        token.userData = {
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: any }) => {
      // console.log("session callback", { session, token });
      // Add property to session, like an access control list
      session.user = token.userData as { name: string; email: string; accessToken: string; image: string };
      session.error = token.error;
      return session;
    },
  },
  session: {
    maxAge: 24 * 60 * 60, // 1 day
    strategy: "jwt",
  },
  // Additional configuration will be added here
};

// Use it in server contexts
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  const serverAuthOptions = { ...authOptions };
  if (serverAuthOptions.callbacks)
    serverAuthOptions.callbacks.session = async ({ session, token }: { session: Session; token: any }) => {
      token.userData.accessToken = token.accessToken;
      token.userData.refreshToken = token.refreshToken;
      token.userData.expiresAt = token.expiresAt;
      token.userData.error = token.error;
      delete token.accessToken;
      session.user = token.userData as { name: string; email: string; accessToken: string; refreshToken: string; expiresAt: number; error: string };
      return session;
    };
  return getServerSession(...args, authOptions);
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export function generateStaticParams() {
//   return [{ nextauth: ["auth"] }];
// }
