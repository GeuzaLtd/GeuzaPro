'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPartners(visible?: boolean) {
  return prisma.partner.findMany({
    where: visible !== undefined ? { isVisible: visible } : {},
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPartner(data: {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
}) {
  const partner = await prisma.partner.create({ data });
  revalidatePath('/dashboard/partners');
  return partner;
}

export async function updatePartner(
  id: number,
  data: Partial<{ name: string; logo: string; website: string; description: string; contactName: string; contactEmail: string; isVisible: boolean }>
) {
  const partner = await prisma.partner.update({ where: { id }, data });
  revalidatePath('/dashboard/partners');
  return partner;
}

export async function deletePartner(id: number) {
  await prisma.partner.delete({ where: { id } });
  revalidatePath('/dashboard/partners');
}
