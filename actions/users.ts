'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, avatar: true, role: true, isVisible: true, createdAt: true },
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
