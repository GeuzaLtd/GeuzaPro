import { getDonations } from '@/actions/donations';
import DonationsView from './_components/DonationsView';

export default async function DonationsPage() {
  const raw = await getDonations();
  const data = raw.map((d) => ({
    id: `D-${d.id}`,
    donor: d.donorName,
    email: d.email,
    amount: `${d.currency} ${Number(d.amount).toLocaleString()}`,
    currency: d.currency,
    method: d.paymentRef ? 'Online' : 'Manual',
    status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
    date: d.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    message: d.message ?? null,
  }));
  return <DonationsView initialData={data} />;
}
