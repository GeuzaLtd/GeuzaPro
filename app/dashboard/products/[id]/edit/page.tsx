import { prisma } from '@/lib/prisma';
import EditProductForm from './_components/EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, allCategories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: { select: { id: true, name: true } },
        images: { orderBy: { isPrimary: 'desc' } },
      },
    }),
    prisma.category.findMany({
      where: { type: 'product', isVisible: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  const data = product ? {
    id:          product.id,
    name:        product.name,
    description: product.description,
    price:       Number(product.price).toString(),
    stock:       product.stock,
    status:      product.status === 'in_stock' ? 'In Stock' : product.status === 'low_stock' ? 'Low Stock' : 'Out Stock',
    categoryIds: product.categories.map((c) => c.id),
    colors:      product.colors,
    sizes:       product.sizes,
    images:      product.images.map((img) => ({ url: img.url })),
  } : null;

  return <EditProductForm product={data} id={id} allCategories={allCategories} />;
}
