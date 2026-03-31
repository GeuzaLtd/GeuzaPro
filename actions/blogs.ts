'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function getBlogs(opts?: { status?: string; visible?: boolean; limit?: number }) {
  return prisma.blog.findMany({
    where: {
      ...(opts?.status ? { status: opts.status } : {}),
      ...(opts?.visible !== undefined ? { isVisible: opts.visible } : {}),
    },
    include: { author: { select: { id: true, name: true, avatar: true } }, category: true },
    orderBy: { publishedAt: 'desc' },
    ...(opts?.limit ? { take: opts.limit } : {}),
  });
}

export async function getBlogBySlug(slug: string) {
  return prisma.blog.findUnique({
    where: { slug },
    include: { author: { select: { id: true, name: true, avatar: true } }, category: true },
  });
}

export async function createBlog(data: {
  title:       string;
  content:     string;
  excerpt?:    string;
  coverImage?: string;
  authorId?:   number;
  categoryId?: number;
  tags?:       string[];
  images?:     string[];
  status?:     string;
}) {
  const slug = slugify(data.title);
  const blog = await prisma.blog.create({
    data: {
      ...data,
      slug,
      tags:        data.tags   ?? [],
      images:      data.images ?? [],
      publishedAt: data.status === 'published' ? new Date() : null,
    },
  });
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  return blog;
}

export async function updateBlog(
  id: number,
  data: Partial<{
    title:       string;
    content:     string;
    excerpt:     string;
    coverImage:  string;
    categoryId:  number | null;
    tags:        string[];
    images:      string[];
    status:      string;
    isVisible:   boolean;
  }>
) {
  const updates: Record<string, unknown> = { ...data };
  if (data.status === 'published') {
    const existing = await prisma.blog.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!existing?.publishedAt) updates.publishedAt = new Date();
  }
  const blog = await prisma.blog.update({ where: { id }, data: updates });
  revalidatePath('/blog');
  revalidatePath(`/blog/${blog.slug}`);
  revalidatePath('/dashboard/blog');
  return blog;
}

export async function deleteBlog(id: number) {
  const blog = await prisma.blog.delete({ where: { id } });
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  return blog;
}

export async function toggleBlogVisibility(id: number, isVisible: boolean) {
  return prisma.blog.update({ where: { id }, data: { isVisible } });
}
