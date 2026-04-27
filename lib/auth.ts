import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  logger: {
    error(error) {
      if ((error as Error).name === 'CredentialsSignin') return;
      console.error('[auth]', error);
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    Google({
      clientId:     process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;
        if (!user.isVisible) return null;
        return { id: String(user.id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // Create a DB user record on first Google sign-in
    async signIn({ account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        const existing = await prisma.user.findUnique({ where: { email: profile.email } });
        if (!existing) {
          await prisma.user.create({
            data: {
              name:     (profile.name ?? profile.email.split('@')[0]),
              email:    profile.email,
              password: '', // no password for OAuth users
              avatar:   (profile as { picture?: string }).picture ?? null,
            },
          });
        } else if (!existing.isVisible) {
          return false; // account disabled
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          // user.id is the Google profile ID — look up our DB id instead
          const dbUser = await prisma.user.findUnique({
            where:  { email: user.email! },
            select: { id: true, role: true },
          });
          token.id   = String(dbUser?.id ?? 0);
          token.role = dbUser?.role ?? 'user';
        } else {
          // Credentials — user.id is already the DB id
          token.id   = user.id;
          token.role = (user as { role?: string }).role ?? 'user';
        }
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
