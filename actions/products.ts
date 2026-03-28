'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProducts(opts?: { categoryId?: number; visible?: boolean }) {
  return prisma.product.findMany({
    where: {
      ...(opts?.visible !== undefined ? { isVisible: opts.visible } : {}),
      ...(opts?.categoryId ? { categoryId: opts.categoryId } : {}),
    },
    include: { images: true, category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
}

export async function createProduct(data: {
  name:         string;
  description?: string;
  price:        number;
  stock?:       number;
  categoryId?:  number;
  colors?:      string[];
  sizes?:       string[];
  images?:      { url: string; isPrimary?: boolean }[];
}) {
  const { images, ...rest } = data;
  const product = await prisma.product.create({
    data: {
      ...rest,
      price:  rest.price,
      colors: rest.colors ?? [],
      sizes:  rest.sizes  ?? [],
      ...(images?.length ? { images: { create: images } } : {}),
    },
    include: { images: true },
  });
  revalidatePath('/shop');
  revalidatePath('/dashboard/products');
  return product;
}

export async function updateProduct(
  id: number,
  data: Partial<{
    name:        string;
    description: string;
    price:       number;
    stock:       number;
    status:      string;
    isVisible:   boolean;
    categoryId:  number;
    colors:      string[];
    sizes:       string[];
    images:      { url: string; isPrimary?: boolean }[];
  }>
) {
  const { images, ...rest } = data;
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(images?.length
        ? { images: { create: images } }
        : {}),
    },
  });
  revalidatePath('/shop');
  revalidatePath('/dashboard/products');
  return product;
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/shop');
  revalidatePath('/dashboard/products');
}

export async function toggleProductVisibility(id: number, isVisible: boolean) {
  return prisma.product.update({ where: { id }, data: { isVisible } });
}

export async function getProductsVariants(ids: number[]) {
  return prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, colors: true, sizes: true },
  });
}
