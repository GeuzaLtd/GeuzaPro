import { prisma } from '@/lib/prisma';
import EditBlogForm from './_components/EditBlogForm';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id: parseInt(id) },
    include: { author: { select: { name: true } }, category: { select: { name: true } } },
  });
  const data = blog ? {
    id: blog.id,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    status: blog.status === 'published' ? 'Published' : 'Draft',
    author: blog.author?.name ?? 'Admin',
    category: blog.category?.name ?? null,
    coverImage: blog.coverImage,
  } : null;
  return <EditBlogForm blog={data} id={id} />;
}
