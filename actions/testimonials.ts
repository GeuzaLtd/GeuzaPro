'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTestimonials(visible?: boolean) {
  return prisma.testimonial.findMany({
    where: visible !== undefined ? { isVisible: visible } : {},
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTestimonial(data: {
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating?: number;
}) {
  const t = await prisma.testimonial.create({ data });
  revalidatePath('/');
  revalidatePath('/dashboard/testimonials');
  return t;
}

export async function updateTestimonial(
  id: number,
  data: Partial<{ name: string; role: string; company: string; avatar: string; quote: string; rating: number; isVisible: boolean }>
) {
  const t = await prisma.testimonial.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/dashboard/testimonials');
  return t;
}

export async function deleteTestimonial(id: number) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/dashboard/testimonials');
}
