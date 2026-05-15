import { getAllCategories } from '@/actions/categories';
import CategoriesView from './_components/CategoriesView';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const data = categories.map((c) => ({
    id:           c.id,
    name:         c.name,
    type:         c.type as 'product' | 'blog',
    isVisible:    c.isVisible,
    productCount: c._count.products,
    blogCount:    c._count.blogs,
  }));

  return <CategoriesView initialData={data} />;
}
