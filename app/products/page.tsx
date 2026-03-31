import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import ProductsHero from './_components/ProductsHero';
import ProductsGrid from './_components/ProductsGrid';
import { getProducts } from '@/actions/products';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Products | Geuza',
  description:
    'Browse our full range of affordable, sustainable assistive mobility devices — wheelchairs, crutches, walking aids, and prosthetics made from repurposed e-waste.',
};

export default async function ProductsPage() {
  const [raw, rawCategories] = await Promise.all([
    getProducts({ visible: true }),
    prisma.category.findMany({ where: { type: 'product', isVisible: true }, orderBy: { name: 'asc' } }),
  ]);
  const products   = raw.map((p) => ({ ...p, price: Number(p.price) }));
  const categories = rawCategories.map((c) => c.name);

  return (
    <>
      <Header />
      <main>
        <ProductsHero />
        <ProductsGrid products={products} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
