'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendContactMessageToAdmin } from '@/lib/email';

export async function getMessages(opts?: { unreadOnly?: boolean; type?: string }) {
  return prisma.message.findMany({
    where: {
      ...(opts?.unreadOnly ? { isRead: false } : {}),
      ...(opts?.type ? { type: opts.type } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMessage(data: {
  fullName:          string;
  email:             string;
  phone?:            string;
  organizationType?: string;
  organizationName?: string;
  message:           string;
  type?:             string;
}) {
  const msg = await prisma.message.create({ data });
  revalidatePath('/dashboard/messages');

  // Notify admin — non-blocking so a mail failure never surfaces to the user
  sendContactMessageToAdmin({
    fullName:          data.fullName,
    email:             data.email,
    phone:             data.phone,
    organizationType:  data.organizationType,
    message:           data.message,
  }).catch((err) => console.error('[message email]', err));

  return msg;
}

export async function markMessageRead(id: number) {
  return prisma.message.update({ where: { id }, data: { isRead: true } });
}

export async function deleteMessage(id: number) {
  await prisma.message.delete({ where: { id } });
  revalidatePath('/dashboard/messages');
}
