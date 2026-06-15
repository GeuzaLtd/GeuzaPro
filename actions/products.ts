'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendWaitlistNotification } from '@/lib/email';

export async function getProducts(opts?: { categoryId?: number; visible?: boolean }) {
  return prisma.product.findMany({
    where: {
      ...(opts?.visible !== undefined ? { isVisible: opts.visible } : {}),
      ...(opts?.categoryId ? { categories: { some: { id: opts.categoryId } } } : {}),
    },
    include: { images: true, categories: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: true, categories: true },
  });
}

export async function createProduct(data: {
  name:          string;
  description?:  string;
  price:         number;
  stock?:        number;
  categoryIds?:  number[];
  colors?:       string[];
  sizes?:        string[];
  images?:       { url: string; isPrimary?: boolean }[];
}) {
  const { images, categoryIds, ...rest } = data;
  const product = await prisma.product.create({
    data: {
      ...rest,
      price:  rest.price,
      colors: rest.colors ?? [],
      sizes:  rest.sizes  ?? [],
      ...(categoryIds?.length ? { categories: { connect: categoryIds.map((id) => ({ id })) } } : {}),
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
    name:         string;
    description:  string;
    price:        number;
    stock:        number;
    status:       string;
    isVisible:    boolean;
    categoryIds:  number[];
    colors:       string[];
    sizes:        string[];
    images:       { url: string; isPrimary?: boolean }[];
  }>
) {
  const { images, categoryIds, ...rest } = data;

  // Detect out_stock → in_stock/low_stock transition before writing
  let waitlistEntries: { id: number; email: string; name: string | null }[] = [];
  if (rest.status && rest.status !== 'out_stock') {
    const current = await prisma.product.findUnique({
      where: { id },
      select: { status: true },
    });
    if (current?.status === 'out_stock') {
      waitlistEntries = await prisma.waitlist.findMany({
        where: { productId: id },
        select: { id: true, email: true, name: true },
      });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(categoryIds !== undefined
        ? { categories: { set: categoryIds.map((cid) => ({ id: cid })) } }
        : {}),
      ...(images?.length ? { images: { create: images } } : {}),
    },
  });

  if (waitlistEntries.length > 0) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geuza.africa';
    const productUrl = `${siteUrl}/shop/${id}`;

    // Fire-and-forget — a mail failure must never break the product update
    Promise.all(
      waitlistEntries.map((e) =>
        sendWaitlistNotification({
          name:        e.name,
          email:       e.email,
          productName: product.name,
          productUrl,
        })
      )
    ).catch((err) => console.error('[waitlist emails]', err));

    await prisma.waitlist.deleteMany({ where: { productId: id } });
    revalidatePath('/dashboard/waitlist');
  }

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
