'use server';

import { signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function loginAction(email: string, password: string) {
  try {
    await signIn('credentials', { email, password, redirect: false });
    // Fetch role to inform the client where to redirect
    const user = await prisma.user.findUnique({ where: { email }, select: { role: true } });
    return { success: true, role: user?.role ?? 'user' };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid email or password.', role: undefined };
    }
    throw error;
  }
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
