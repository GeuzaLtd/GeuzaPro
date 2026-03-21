'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories(type?: 'product' | 'blog') {
  return prisma.category.findMany({
    where: {
      ...(type ? { type } : {}),
      isVisible: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function createCategory(data: { name: string; type: 'product' | 'blog' }) {
  const cat = await prisma.category.create({ data });
  revalidatePath('/dashboard');
  return cat;
}

export async function updateCategory(
  id: number,
  data: Partial<{ name: string; isVisible: boolean }>
) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/dashboard');
}
