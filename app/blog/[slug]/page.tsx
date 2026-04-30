import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components';
import { getBlogBySlug, getOtherBlogs, getPublishedBlogs, formatBlogDate } from '@/lib/db-blogs';
import BlogHero from '../_components/BlogHero';
import BlogContent from './_components/BlogContent';
import BlogSidebar from './_components/BlogSidebar';
import MorePosts from './_components/MorePosts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geuza.africa';

interface Props {
  params: Promise<{ slug: string }>;
}

// Pre-render every published blog post at build time
export async function generateStaticParams() {
  const posts = await getPublishedBlogs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};

  const url        = `${SITE_URL}/blog/${post.slug}`;
  const ogImage    = post.coverImage ?? `${SITE_URL}/og-default.jpg`;
  const published  = post.publishedAt?.toISOString();
  const authorName = post.author?.name ?? 'Geuza';

  return {
    title:       post.title,
    description: post.excerpt ?? `Read "${post.title}" on the Geuza blog.`,
    keywords:    [
      post.category?.name,
      'assistive devices', 'disability inclusion', 'mobility aids', 'Geuza',
    ].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: {
      type:             'article',
      url,
      title:            post.title,
      description:      post.excerpt ?? undefined,
      images:           [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime:    published,
      authors:          [authorName],
      section:          post.category?.name ?? 'Blog',
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.excerpt ?? undefined,
      images:      [ogImage],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post, otherPosts] = await Promise.all([
    getBlogBySlug(slug),
    getOtherBlogs(slug, 4),
  ]);

  if (!post) notFound();

  // Article JSON-LD for Google rich results
  const jsonLd = {
    '@context':        'https://schema.org',
    '@type':           'Article',
    headline:          post.title,
    description:       post.excerpt ?? undefined,
    image:             post.coverImage ?? undefined,
    datePublished:     post.publishedAt?.toISOString(),
    dateModified:      post.publishedAt?.toISOString(),
    url:               `${SITE_URL}/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name:    post.author?.name ?? 'Geuza',
    },
    publisher: {
      '@type': 'Organization',
      name:    'Geuza',
      logo: {
        '@type': 'ImageObject',
        url:     `${SITE_URL}/logo.png`,
      },
    },
    articleSection: post.category?.name ?? 'Blog',
    mainEntityOfPage: {
      '@type': '@WebPage',
      '@id':   `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <BlogHero />

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

        <MorePosts posts={otherPosts} />
      </main>
      <Footer />
    </>
  );
}
