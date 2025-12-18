// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Profile as NextAuthProfile } from "next-auth";
import GithubProvider from "next-auth/providers/github";

interface Profile extends NextAuthProfile {
  id?: string;
}

// ✅ Keep authOptions but don't export it (Vercel build error fix)
const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: any; account: any; profile?: Profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.githubId = profile?.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.user.githubId = token.githubId as string;
      return session;
    },
  },
  pages: {
    signIn: '/signin', // ✅ Changed from '/auth/signin' to '/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// ✅ Only export GET and POST handlers
export { handler as GET, handler as POST };