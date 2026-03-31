import { prisma } from '@/lib/prisma';
import EditBlogForm from './_components/EditBlogForm';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [blog, allCategories] = await Promise.all([
    prisma.blog.findUnique({
      where: { id: parseInt(id) },
      include: { author: { select: { name: true } }, category: { select: { id: true, name: true } } },
    }),
    prisma.category.findMany({
      where: { type: 'blog', isVisible: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  const data = blog ? {
    id:         blog.id,
    title:      blog.title,
    excerpt:    blog.excerpt,
    content:    blog.content,
    status:     blog.status === 'published' ? 'Published' : 'Draft',
    author:     blog.author?.name ?? 'Admin',
    categoryId: blog.category?.id ?? null,
    coverImage: blog.coverImage,
    tags:       blog.tags,
    images:     blog.images,
  } : null;

  return <EditBlogForm blog={data} id={id} allCategories={allCategories} />;
}
