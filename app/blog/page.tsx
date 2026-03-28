import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import BlogHero from './_components/BlogHero';
import RecentPost from './_components/RecentPost';
import OtherPosts from './_components/OtherPosts';
import { getPublishedBlogs } from '@/lib/db-blogs';

export const metadata: Metadata = {
  title: 'Blog | Geuza',
  description:
    'Read the latest news, stories, and insights from Geuza on assistive mobility, disability inclusion, and sustainable innovation.',
};

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();
  const [recent, ...others] = blogs;

  return (
    <>
      <Header />
      <main>
        <BlogHero />
        {recent && <RecentPost post={recent} />}
        <OtherPosts posts={others} />
      </main>
      <Footer />
    </>
  );
}
