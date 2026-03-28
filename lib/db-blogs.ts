import { prisma } from './prisma';

export interface BlogPostDb {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  readTime: number | null;
  publishedAt: Date | null;
  createdAt: Date;
  author: { name: string; avatar: string | null } | null;
  category: { name: string } | null;
}

const include = {
  author: { select: { name: true, avatar: true } },
  category: { select: { name: true } },
} as const;

export async function getPublishedBlogs(): Promise<BlogPostDb[]> {
  return prisma.blog.findMany({
    where: { status: 'published', isVisible: true },
    orderBy: { publishedAt: 'desc' },
    include,
  });
}

export async function getBlogBySlug(slug: string): Promise<BlogPostDb | null> {
  return prisma.blog.findFirst({
    where: { slug, status: 'published', isVisible: true },
    include,
  });
}

export async function getOtherBlogs(currentSlug: string, limit = 4): Promise<BlogPostDb[]> {
  return prisma.blog.findMany({
    where: { slug: { not: currentSlug }, status: 'published', isVisible: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include,
  });
}

export function formatBlogDate(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
