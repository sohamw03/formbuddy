import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const scopes = [
  //
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.appdata",
];

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  // Providers array will be configured in the next steps
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { scope: scopes.join(" ") } },
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
    jwt: async ({ token, user, account }) => {
      // console.log("jwt callback", { token, user, account, profile, trigger });
      if (user) {
        // Add custom claims to the JWT. These will be saved in the JWT.
        token.userData = {
          name: user.name,
          email: user.email,
          accessToken: account?.access_token,
        } as { name: string; email: string; accessToken: string };
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      // console.log("session callback", { session, token });
      // Add property to session, like an access control list
      session.user = token.userData as { name: string; email: string, accessToken: string };
      return session;
    },
  },
  session: {
    maxAge: 24 * 60 * 60, // 1 day
    strategy: "jwt",
  },
  // Additional configuration will be added here
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
