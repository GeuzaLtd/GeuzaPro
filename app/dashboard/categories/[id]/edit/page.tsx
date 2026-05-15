import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditCategoryForm from './_components/EditCategoryForm';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });

  if (!category) notFound();

  return (
    <EditCategoryForm
      category={{
        id:        category.id,
        name:      category.name,
        type:      category.type as 'product' | 'blog',
        isVisible: category.isVisible,
      }}
    />
  );
}
