import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import ShopHero from './_components/ShopHero';
import ShopGrid from './_components/ShopGrid';
import { getProducts } from '@/actions/products';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Shop our full range of affordable assistive mobility devices — wheelchairs, crutches, walking aids, and prosthetics made from repurposed e-waste.',
};

export default async function ShopPage() {
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
        <ShopHero />
        <ShopGrid products={products} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
