'use server';

import { prisma } from '@/lib/prisma';
import type { CartItem } from '@/lib/cart-context';

async function getOrCreateCart(userId: number) {
  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });
  return cart;
}

/** Load a user's cart from DB, enriching each item with product name + primary image. */
export async function getDbCart(userId: number): Promise<CartItem[]> {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name:   true,
              images: { where: { isPrimary: true }, take: 1, select: { url: true } },
            },
          },
        },
      },
    },
  });

  if (!cart) return [];

  return cart.items.map((item) => ({
    productId: item.productId,
    name:      item.product.name,
    image:     item.product.images[0]?.url ?? null,
    quantity:  item.quantity,
    size:      item.size  ?? undefined,
    color:     item.color ?? undefined,
  }));
}

/** Replace the user's entire DB cart with the provided items. */
export async function saveDbCart(
  userId: number,
  items:  { productId: number; quantity: number; size?: string; color?: string }[],
): Promise<void> {
  const cart = await getOrCreateCart(userId);

  // Use sequential awaits instead of $transaction — PgBouncer (Supabase) can silently
  // drop batch transactions when using the PrismaPg driver adapter.
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  if (items.length > 0) {
    await prisma.cartItem.createMany({
      data: items.map((i) => ({
        cartId:    cart.id,
        productId: i.productId,
        quantity:  i.quantity,
        size:      i.size,
        color:     i.color,
      })),
    });
  }

  // Touch the cart row so updatedAt reflects the last sync time
  await prisma.cart.update({ where: { id: cart.id }, data: {} });
}
