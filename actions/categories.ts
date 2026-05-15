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

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
    include: {
      _count: { select: { products: true, blogs: true } },
    },
  });
}

export async function createCategory(data: { name: string; type: 'product' | 'blog' }) {
  const cat = await prisma.category.create({ data });
  revalidatePath('/dashboard/categories');
  return cat;
}

export async function updateCategory(
  id: number,
  data: Partial<{ name: string; isVisible: boolean }>
) {
  const cat = await prisma.category.update({ where: { id }, data });
  revalidatePath('/dashboard/categories');
  return cat;
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/dashboard/categories');
}
