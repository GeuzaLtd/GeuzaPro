'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendOrderConfirmationToCustomer, sendOrderNotificationToAdmin } from '@/lib/email';

// ─── Admin helpers ────────────────────────────────────────────────────────────

export async function getOrders(opts?: { status?: string }) {
  return prisma.order.findMany({
    where: {
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

export async function updateOrderStatus(id: number, status: string) {
  const order = await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath('/dashboard/orders');
  return order;
}

// ─── Public: place a guest order ─────────────────────────────────────────────

export interface OrderItemInput {
  productId: number;
  name:      string;
  quantity:  number;
  size?:     string;
  color?:    string;
}

export interface PlaceOrderInput {
  name:     string;
  email:    string;
  phone:    string;
  address?: string;
  notes?:   string;
  items:    OrderItemInput[];
}

function generateOrderNumber(): string {
  const date   = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GZA-${date}-${suffix}`;
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: true; orderNumber: string } | { success: false; error: string }> {
  if (!input.items.length) return { success: false, error: 'Cart is empty.' };

  const orderNumber = generateOrderNumber();

  try {
    await prisma.order.create({
      data: {
        orderNumber,
        guestName:       input.name,
        guestEmail:      input.email,
        guestPhone:      input.phone,
        shippingAddress: input.address,
        notes:           input.notes,
        status:          'pending',
        items: {
          create: input.items.map((i) => ({
            productId: i.productId,
            quantity:  i.quantity,
            size:      i.size  ?? null,
            color:     i.color ?? null,
          })),
        },
      },
    });

    // Emails — don't let failures break the order
    await Promise.allSettled([
      sendOrderConfirmationToCustomer({ name: input.name, email: input.email, orderNumber, items: input.items }),
      sendOrderNotificationToAdmin({ orderNumber, name: input.name, email: input.email, phone: input.phone, address: input.address, notes: input.notes, items: input.items }),
    ]);

    revalidatePath('/dashboard/orders');
    return { success: true, orderNumber };
  } catch (err) {
    console.error('Order creation failed:', err);
    return { success: false, error: 'Failed to place order. Please try again.' };
  }
}
