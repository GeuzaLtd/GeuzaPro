'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getOrders(opts?: { userId?: number; status?: string }) {
  return prisma.order.findMany({
    where: {
      ...(opts?.userId ? { userId: opts.userId } : {}),
      ...(opts?.status ? { status: opts.status } : {}),
    },
    include: {
      items: { include: { product: { include: { images: true } } } },
      user:  { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderById(id: number) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { images: true } } } },
      user:  { select: { id: true, name: true, email: true } },
    },
  });
}

export async function createOrderFromCart(userId: number, shippingAddress: string, notes?: string) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return { success: false, error: 'Cart is empty.' };
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      shippingAddress,
      notes,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity:  item.quantity,
          unitPrice: item.product.price,
        })),
      },
    },
  });

  // Clear cart after order
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  revalidatePath('/dashboard/orders');
  return { success: true, order };
}

export async function updateOrderStatus(id: number, status: string) {
  const order = await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath('/dashboard/orders');
  return order;
}
