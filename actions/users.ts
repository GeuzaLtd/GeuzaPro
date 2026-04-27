'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true, name: true, email: true, phone: true, avatar: true,
      role: true, isVisible: true, createdAt: true,
      _count: { select: { orders: true, donations: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, phone: true, avatar: true, role: true, isVisible: true, createdAt: true },
  });
}

export async function updateUser(
  id: number,
  data: Partial<{ name: string; phone: string; avatar: string; role: string; isVisible: boolean }>
) {
  const user = await prisma.user.update({ where: { id }, data });
  revalidatePath('/dashboard/users');
  return user;
}

export async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id } });
  revalidatePath('/dashboard/users');
}

// ─── Profile (user-facing) ────────────────────────────────────────────────────

export async function getProfileData(userId: number) {
  const [user, orders, donations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true,
        avatar: true, role: true, password: true, createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: { where: { isPrimary: true }, take: 1, select: { url: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.donation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { user, orders, donations };
}

export async function updateProfile(
  userId: number,
  data: { name: string; phone?: string; avatar?: string },
) {
  await prisma.user.update({ where: { id: userId }, data });
  revalidatePath('/profile');
  return { success: true };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });
  if (!user) return { success: false, error: 'User not found.' };
  if (!user.password) return { success: false, error: 'Password change is not available for social accounts.' };

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return { success: false, error: 'Current password is incorrect.' };

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return { success: true };
}
