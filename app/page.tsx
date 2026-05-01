import {
  Header,
  Hero,
  About,
  Products,
  Blog,
  Impact,
  Testimonials,
  Team,
  Contact,
  Footer,
} from '@/components';
import type { ProductItem } from '@/components/Products';
import type { TestimonialItem } from '@/components/Testimonials';
import type { LatestPost } from '@/components/Blog';
import type { TeamMember } from '@/components/Team';
import { prisma } from '@/lib/prisma';
import { getHeroImages } from '@/actions/hero-images';

export default async function Home() {
  const [heroImages, rawProducts, rawTestimonials, latestBlog, rawEmployees] = await Promise.all([
    getHeroImages('home'),
    prisma.product.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.blog.findFirst({
      where: { status: 'published', isVisible: true },
      orderBy: { publishedAt: 'desc' },
      select: { title: true, excerpt: true, coverImage: true, slug: true },
    }),
    prisma.employee.findMany({
      where: { isVisible: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    }),
  ]);

  const products: ProductItem[] = rawProducts.map((p) => ({
    id:      p.id,
    name:    p.name,
    inStock: p.status !== 'out_stock',
    image:   p.images[0]?.url ?? null,
  }));

  const testimonials: TestimonialItem[] = rawTestimonials.map((t) => ({
    id:      t.id,
    name:    t.name,
    role:    t.role,
    company: t.company,
    avatar:  t.avatar,
    quote:   t.quote,
    rating:  t.rating,
  }));

  const latestPost: LatestPost | null = latestBlog ?? null;

  const members: TeamMember[] = rawEmployees.map((e) => ({
    id:     e.id,
    name:   e.name,
    role:   e.role,
    avatar: e.avatar,
  }));

  return (
    <>
      <Header />
      <main>
        <Hero images={heroImages.map((i) => ({ url: i.url, alt: i.alt }))} />
        <About />
        <Products products={products} />
        <Blog latestPost={latestPost} />
        <Impact />
        <Testimonials testimonials={testimonials} />
        <Team members={members} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
