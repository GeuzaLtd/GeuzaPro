'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDonations(opts?: { status?: string; userId?: number }) {
  return prisma.donation.findMany({
    where: {
      ...(opts?.status ? { status: opts.status } : {}),
      ...(opts?.userId ? { userId: opts.userId } : {}),
    },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createDonation(data: {
  donorName: string;
  email: string;
  amount: number;
  currency?: string;
  message?: string;
  userId?: number;
}) {
  const donation = await prisma.donation.create({ data });
  revalidatePath('/dashboard/donations');
  return donation;
}

export async function updateDonationStatus(id: number, status: string, paymentRef?: string) {
  const donation = await prisma.donation.update({
    where: { id },
    data:  { status, ...(paymentRef ? { paymentRef } : {}) },
  });
  revalidatePath('/dashboard/donations');
  return donation;
}
