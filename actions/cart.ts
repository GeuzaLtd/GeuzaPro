'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function getOrCreateCart(userId: number) {
  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });
  return cart;
}

export async function getCart(userId: number) {
  return prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: { include: { images: true } } } } },
  });
}

export async function addToCart(userId: number, productId: number, quantity = 1) {
  const cart = await getOrCreateCart(userId);

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data:  { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }

  revalidatePath('/shop');
  return { success: true };
}

export async function updateCartItem(cartItemId: number, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
  }
  revalidatePath('/shop');
}

export async function removeFromCart(cartItemId: number) {
  await prisma.cartItem.delete({ where: { id: cartItemId } });
  revalidatePath('/shop');
}

export async function clearCart(userId: number) {
  const cart = await prisma.cart.findFirst({ where: { userId } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  revalidatePath('/shop');
}
