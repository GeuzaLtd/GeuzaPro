import { prisma } from '@/lib/prisma';
import EditProductForm from './_components/EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: { select: { name: true } }, images: { orderBy: { isPrimary: 'desc' } } },
  });
  const data = product ? {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price).toString(),
    stock: product.stock,
    status: product.status === 'in_stock' ? 'In Stock' : product.status === 'low_stock' ? 'Low Stock' : 'Out Stock',
    category: product.category?.name ?? null,
    colors:   product.colors,
    images:   product.images.map((img) => ({ url: img.url })),
  } : null;
  return <EditProductForm product={data} id={id} />;
}
