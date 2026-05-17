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
import WelcomeBanner from '@/components/WelcomeBanner';
import type { ProductItem } from '@/components/Products';
import type { TestimonialItem } from '@/components/Testimonials';
import type { LatestPost } from '@/components/Blog';
import type { TeamMember } from '@/components/Team';
import { prisma } from '@/lib/prisma';
import { getHeroImages } from '@/actions/hero-images';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geuza.africa';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:        'Geuza',
  url:         SITE_URL,
  logo:        `${SITE_URL}/images/logo.png`,
  description: 'Geuza transforms e-waste into smart assistive devices, empowering people with disabilities across Africa.',
  sameAs: [
    'https://www.facebook.com/geuzaltd',
    'https://x.com/GeuzaLtd',
    'https://www.instagram.com/geuza_ltd',
    'https://www.linkedin.com/company/geuza-africa/',
  ],
  contactPoint: {
    '@type':             'ContactPoint',
    contactType:         'customer support',
    availableLanguage:   ['English'],
    url:                 `${SITE_URL}/contact`,
  },
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <WelcomeBanner />
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
