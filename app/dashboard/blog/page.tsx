import { getBlogs } from '@/actions/blogs';
import BlogView from './_components/BlogView';

export default async function BlogPage() {
  const raw = await getBlogs();
  const data = raw.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    status: b.status === 'published' ? 'Published' : 'Draft',
    author: b.author?.name ?? 'Admin',
    category: b.category?.name ?? 'Uncategorized',
    createdAt: (b.publishedAt ?? b.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    views: 0,
  }));
  return <BlogView initialData={data} />;
}
