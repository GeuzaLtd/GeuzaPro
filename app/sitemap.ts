import type { MetadataRoute } from 'next';
import { getPublishedBlogs } from '@/lib/db-blogs';
import { getProducts } from '@/actions/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geuza.africa';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${SITE_URL}/shop`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${SITE_URL}/products`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${SITE_URL}/blog`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
  { url: `${SITE_URL}/company`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/donate`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/partner`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/faq`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/terms`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${SITE_URL}/privacy-policy`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, products] = await Promise.all([
    getPublishedBlogs(),
    getProducts({ visible: true }),
  ]);

  const blogUrls: MetadataRoute.Sitemap = blogs.map((post) => ({
    url:             `${SITE_URL}/blog/${post.slug}`,
    lastModified:    post.publishedAt ?? post.createdAt,
    changeFrequency: 'monthly',
    priority:        0.7,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url:             `${SITE_URL}/shop/${p.id}`,
    lastModified:    new Date(),
    changeFrequency: 'weekly',
    priority:        0.8,
  }));

  return [...STATIC_PAGES, ...blogUrls, ...productUrls];
}
