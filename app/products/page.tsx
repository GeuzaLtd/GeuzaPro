import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import ProductsHero from './_components/ProductsHero';
import ProductsGrid from './_components/ProductsGrid';
import { getProducts } from '@/actions/products';

export const metadata: Metadata = {
  title: 'Products | Geuza',
  description:
    'Browse our full range of affordable, sustainable assistive mobility devices — wheelchairs, crutches, walking aids, and prosthetics made from repurposed e-waste.',
};

export default async function ProductsPage() {
  const raw = await getProducts({ visible: true });
  const products = raw.map((p) => ({ ...p, price: Number(p.price) }));

  return (
    <>
      <Header />
      <main>
        <ProductsHero />
        <ProductsGrid products={products} />
      </main>
      <Footer />
    </>
  );
}
