import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components';
import { blogPosts, getPostBySlug, getOtherPosts } from '@/lib/blog-posts';
import BlogHero from '../_components/BlogHero';
import BlogContent from './_components/BlogContent';
import BlogSidebar from './_components/BlogSidebar';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Geuza Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = getOtherPosts(slug, 4);

  return (
    <>
      <Header />
      <main>
        <BlogHero />

        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
              {/* Main content */}
              <BlogContent post={post} />

              {/* Sidebar */}
              <div className="lg:pt-1">
                <BlogSidebar posts={otherPosts} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
