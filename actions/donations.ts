'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  sendDonationThankYouToDonor,
  sendDonationNotificationToAdmin,
} from '@/lib/email';

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
  email:     string;
  phone?:    string;
  amount:    number;
  currency?: string;
  message?:  string;
  userId?:   number;
}): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const donation = await prisma.donation.create({
      data: {
        donorName: data.donorName,
        email:     data.email,
        phone:     data.phone,
        amount:    data.amount,
        currency:  data.currency ?? 'RWF',
        message:   data.message,
        userId:    data.userId,
      },
    });
    revalidatePath('/dashboard/donations');

    // Emails — non-blocking so a mail failure never rolls back the saved record
    await Promise.allSettled([
      sendDonationThankYouToDonor({
        name:     data.donorName,
        email:    data.email,
        amount:   data.amount,
        currency: data.currency ?? 'RWF',
      }),
      sendDonationNotificationToAdmin({
        donationId: donation.id,
        name:       data.donorName,
        email:      data.email,
        phone:      data.phone,
        amount:     data.amount,
        currency:   data.currency ?? 'RWF',
        message:    data.message,
      }),
    ]);

    return { success: true };
  } catch (err) {
    console.error('[createDonation]', err);
    return { success: false, error: 'Failed to submit your donation. Please try again.' };
  }
}

export async function updateDonationStatus(id: number, status: string, paymentRef?: string) {
  const donation = await prisma.donation.update({
    where: { id },
    data:  { status, ...(paymentRef ? { paymentRef } : {}) },
  });
  revalidatePath('/dashboard/donations');
  return donation;
}
