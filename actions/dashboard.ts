'use server';

import { prisma } from '@/lib/prisma';

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function getDashboardStats() {
  const [productCount, orderCount, userCount, blogCount, donationAgg, recentOrders, recentBlogs] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.blog.count({ where: { status: 'published' } }),
      prisma.donation.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user:  { select: { name: true } },
          items: { take: 1, include: { product: { select: { name: true } } } },
        },
      }),
      prisma.blog.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, publishedAt: true, createdAt: true },
      }),
    ]);

  return {
    productCount,
    orderCount,
    userCount,
    blogCount,
    donationTotal: Number(donationAgg._sum.amount ?? 0),
    recentOrders: recentOrders.map((o) => ({
      id:       `#${o.id}`,
      customer: o.user?.name ?? o.guestName ?? 'Guest',
      item:     o.items[0]?.product.name ?? 'Multiple items',
      status:   o.status.charAt(0).toUpperCase() + o.status.slice(1),
      date:     fmtDate(o.createdAt),
    })),
    recentBlogs: recentBlogs.map((b) => ({
      id:     b.id,
      title:  b.title,
      status: b.status === 'published' ? 'Published' : 'Draft',
      date:   fmtDate(b.publishedAt ?? b.createdAt),
    })),
  };
}
