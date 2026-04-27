'use server';

import { signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function loginAction(email: string, password: string) {
  // Step 1: verify credentials manually so we can give accurate error messages
  // and handle the Auth.js v5 false-positive CredentialsSignin throw gracefully.
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isVisible) {
    return { success: false, error: 'Invalid email or password.', role: undefined };
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: 'Invalid email or password.', role: undefined };
  }

  // Step 2: credentials are valid — create the NextAuth session.
  // In Auth.js v5, signIn() sometimes throws CredentialsSignin even on success
  // (the session cookie is set before the error is thrown). Since we already
  // verified credentials above we treat that specific throw as a non-fatal false positive.
  try {
    await signIn('credentials', { email, password, redirect: false });
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;              // unexpected — rethrow
    if (error.type !== 'CredentialsSignin') {
      return { success: false, error: 'Something went wrong. Please try again.', role: undefined };
    }
    // CredentialsSignin false positive — session was created, continue normally
  }

  return { success: true, role: user.role };
}

export async function registerAction(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { success: false, error: 'Email already in use.' };

  const hashed = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      name:     data.name,
      email:    data.email,
      password: hashed,
      phone:    data.phone,
    },
  });
  return { success: true };
}

export async function logoutAction() {
  await signOut({ redirect: false });
}
