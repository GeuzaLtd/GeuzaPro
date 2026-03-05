import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import BlogHero from './_components/BlogHero';
import RecentPost from './_components/RecentPost';
import OtherPosts from './_components/OtherPosts';

export const metadata: Metadata = {
  title: 'Blog | Geuza',
  description:
    'Read the latest news, stories, and insights from Geuza on assistive mobility, disability inclusion, and sustainable innovation.',
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <BlogHero />
        <RecentPost />
        <OtherPosts />
      </main>
      <Footer />
    </>
  );
}
