import { getWaitlist } from '@/actions/waitlist';
import WaitlistView from './_components/WaitlistView';

export default async function WaitlistPage() {
  const raw = await getWaitlist();
  const data = raw.map((w) => ({
    id:          w.id,
    email:       w.email,
    name:        w.name,
    productId:   w.productId,
    productName: w.product.name,
    status:      w.product.status,
    date:        w.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));
  return <WaitlistView initialData={data} />;
}
