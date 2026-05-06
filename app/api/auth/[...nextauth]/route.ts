import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    // 🔥 GitHub Login
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
          prompt: "login",
        },
      },
    }),

    // 🔥 Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;

        // Save GitHub ID (only if GitHub login)
        if (account.provider === "github") {
          token.githubId = profile?.id;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      session.provider = token.provider;
      session.accessToken = token.accessToken;
      session.user.githubId = token.githubId;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };