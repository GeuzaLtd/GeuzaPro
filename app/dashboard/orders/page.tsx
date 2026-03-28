import { getOrders } from '@/actions/orders';
import OrdersView from './_components/OrdersView';

export default async function OrdersPage() {
  const raw = await getOrders();
  const data = raw.map((o) => ({
    id:       `#${o.id}`,
    orderNumber: o.orderNumber,
    customer: o.user?.name ?? o.guestName ?? 'Guest',
    email:    o.user?.email ?? o.guestEmail ?? '',
    phone:    o.guestPhone ?? '',
    item:     o.items[0]?.product.name ?? 'Multiple items',
    qty:      o.items[0]?.quantity ?? 1,
    status:   o.status.charAt(0).toUpperCase() + o.status.slice(1),
    date:     o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    address:  o.shippingAddress ?? '',
    notes:    o.notes,
  }));
  return <OrdersView initialData={data} />;
}
