import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import BlogHero from './_components/BlogHero';
import RecentPost from './_components/RecentPost';
import OtherPosts from './_components/OtherPosts';
import { getPublishedBlogs } from '@/lib/db-blogs';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Read the latest news, stories, and insights from Geuza on assistive mobility devices, disability inclusion, e-waste recycling, and sustainable innovation in Africa.',
  keywords: [
    'assistive devices blog', 'disability inclusion Africa', 'e-waste recycling innovation',
    'mobility aids news', 'wheelchair stories', 'Geuza blog', 'sustainable assistive technology',
  ],
  openGraph: {
    type: 'website',
    title: 'Geuza Blog – Stories of Mobility & Inclusion',
    description:
      'News, stories, and insights on assistive mobility, disability inclusion, and sustainable innovation from Geuza.',
  },
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
