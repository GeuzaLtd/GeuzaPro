'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function joinWaitlist(data: {
  email:     string;
  name?:     string;
  productId: number;
}) {
  try {
    await prisma.waitlist.upsert({
      where: { email_productId: { email: data.email, productId: data.productId } },
      create: { email: data.email, name: data.name, productId: data.productId },
      update: {},
    });
    revalidatePath('/dashboard/waitlist');
    return { success: true };
  } catch {
    return { success: false, error: 'Could not save your request. Please try again.' };
  }
}

export async function getWaitlist() {
  return prisma.waitlist.findMany({
    include: {
      product: { select: { id: true, name: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteWaitlistEntry(id: number) {
  await prisma.waitlist.delete({ where: { id } });
  revalidatePath('/dashboard/waitlist');
}
