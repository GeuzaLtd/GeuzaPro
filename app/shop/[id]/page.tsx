import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components';
import { getProductById } from '@/actions/products';
import ProductDetail from './_components/ProductDetail';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geuza.africa';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return {};

  const url      = `${SITE_URL}/shop/${product.id}`;
  const primary  = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const ogImage  = primary?.url ?? `${SITE_URL}/og-default.jpg`;

  return {
    title:       `${product.name} | Geuza Shop`,
    description: product.description ?? `Order ${product.name} from Geuza — smart assistive devices made from repurposed e-waste.`,
    alternates:  { canonical: url },
    openGraph: {
      type:        'website',
      url,
      title:       `${product.name} | Geuza Shop`,
      description: product.description ?? undefined,
      images:      [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${product.name} | Geuza Shop`,
      description: product.description ?? undefined,
      images:      [ogImage],
    },
  };
}

const AVAILABILITY: Record<string, string> = {
  in_stock:  'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  out_stock: 'https://schema.org/OutOfStock',
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const raw = await getProductById(Number(id));
  if (!raw || !raw.isVisible) notFound();
  const product = { ...raw, price: Number(raw.price) };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'Product',
    name:        product.name,
    description: product.description ?? undefined,
    image:       product.images.map((i) => i.url),
    brand: {
      '@type': 'Organization',
      name:    'Geuza',
    },
    category: product.categories.map((c) => c.name).join(', ') || undefined,
    offers: {
      '@type':          'Offer',
      url:              `${SITE_URL}/shop/${product.id}`,
      priceCurrency:    'RWF',
      price:            product.price.toFixed(2),
      availability:     AVAILABILITY[product.status] ?? 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name:    'Geuza',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
