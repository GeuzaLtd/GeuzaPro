'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getMessages(opts?: { unreadOnly?: boolean }) {
  return prisma.message.findMany({
    where: opts?.unreadOnly ? { isRead: false } : {},
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMessage(data: {
  fullName: string;
  email: string;
  phone?: string;
  organizationType?: string;
  message: string;
}) {
  const msg = await prisma.message.create({ data });
  revalidatePath('/dashboard/messages');
  return msg;
}

export async function markMessageRead(id: number) {
  return prisma.message.update({ where: { id }, data: { isRead: true } });
}

export async function deleteMessage(id: number) {
  await prisma.message.delete({ where: { id } });
  revalidatePath('/dashboard/messages');
}
