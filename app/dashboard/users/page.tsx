import { prisma } from '@/lib/prisma';
import UsersView from './_components/UsersView';

export default async function UsersPage() {
  const raw = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVisible: true,
      createdAt: true,
      _count: { select: { orders: true, donations: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const data = raw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email ?? '',
    role:
      u.role === 'admin'
        ? 'Admin'
        : u.role === 'donor'
        ? 'Donor'
        : 'User',
    status: u.isVisible ? 'Active' : 'Inactive',
    joined: u.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    orders: u._count.orders,
    donations: u._count.donations,
  }));

  return <UsersView initialData={data} />;
}
