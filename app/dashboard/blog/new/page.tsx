import { prisma } from '@/lib/prisma';
import NewBlogForm from './_components/NewBlogForm';

export default async function NewBlogPostPage() {
  const allCategories = await prisma.category.findMany({
    where: { type: 'blog', isVisible: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
  return <NewBlogForm allCategories={allCategories} />;
}
