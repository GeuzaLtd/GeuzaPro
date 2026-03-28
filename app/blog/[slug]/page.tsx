import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components';
import { getBlogBySlug, getOtherBlogs } from '@/lib/db-blogs';
import BlogHero from '../_components/BlogHero';
import BlogContent from './_components/BlogContent';
import BlogSidebar from './_components/BlogSidebar';
import MorePosts from './_components/MorePosts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Geuza Blog`,
    description: post.excerpt ?? undefined,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post, otherPosts] = await Promise.all([
    getBlogBySlug(slug),
    getOtherBlogs(slug, 4),
  ]);

  if (!post) notFound();

  return (
    <>
      <Header />
      <main>
        <BlogHero />

        {/* Article + sidebar */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">
              <BlogContent post={post} />
              <div className="lg:pt-1">
                <BlogSidebar posts={otherPosts} />
              </div>
            </div>
          </div>
        </div>

        {/* More posts — full width below article */}
        <MorePosts posts={otherPosts} />
      </main>
      <Footer />
    </>
  );
}
