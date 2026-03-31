import { prisma } from '@/lib/prisma';
import NewProductForm from './_components/NewProductForm';

export default async function NewProductPage() {
  const allCategories = await prisma.category.findMany({
    where: { type: 'product', isVisible: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return <NewProductForm allCategories={allCategories} />;
}
