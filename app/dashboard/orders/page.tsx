import { getOrders } from '@/actions/orders';
import OrdersView from './_components/OrdersView';

export default async function OrdersPage() {
  const raw = await getOrders();
  const data = raw.map((o) => ({
    id: `#${o.id}`,
    customer: o.user.name,
    email: o.user.email ?? '',
    item: o.items[0]?.product.name ?? 'Multiple items',
    qty: o.items[0]?.quantity ?? 1,
    total: `RWF ${Number(o.total).toLocaleString()}`,
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
    date: o.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    address: o.shippingAddress ?? '',
    notes: o.notes,
  }));
  return <OrdersView initialData={data} />;
}
