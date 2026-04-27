import { getProducts } from '@/actions/products';
import ProductsView from './_components/ProductsView';

export default async function ProductsPage() {
  const raw = await getProducts();
  const data = raw.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: `RWF ${Number(p.price).toLocaleString()}`,
    stock: p.stock,
    status:
      p.status === 'in_stock'
        ? 'In Stock'
        : p.status === 'low_stock'
        ? 'Low Stock'
        : 'Out of Stock',
    isVisible: p.isVisible,
    category: p.categories.map((c) => c.name).join(', ') || null,
    createdAt: p.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }));
  return <ProductsView initialData={data} />;
}
