import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Header, Footer } from '@/components';
import { getProfileData } from '@/actions/users';
import ProfileView from './_components/ProfileView';

export const metadata = { title: 'My Profile' };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const userId = parseInt(session.user.id);
  const { user, orders, donations } = await getProfileData(userId);
  if (!user) redirect('/sign-in');

  // Don't expose the hashed password to the client — just indicate if it's set
  const hasPassword = !!user.password;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <ProfileView
          user={{ id: user.id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role, createdAt: user.createdAt.toISOString() }}
          orders={orders.map((o) => ({
            id:          o.id,
            orderNumber: o.orderNumber,
            status:      o.status,
            createdAt:   o.createdAt.toISOString(),
            items:       o.items.map((i) => ({
              name:     i.product.name,
              quantity: i.quantity,
              size:     i.size  ?? undefined,
              color:    i.color ?? undefined,
              image:    i.product.images[0]?.url ?? null,
            })),
          }))}
          donations={donations.map((d) => ({
            id:        d.id,
            amount:    Number(d.amount),
            currency:  d.currency,
            status:    d.status,
            createdAt: d.createdAt.toISOString(),
          }))}
          hasPassword={hasPassword}
        />
      </main>
      <Footer />
    </>
  );
}
