import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import ShopHero from './_components/ShopHero';
import ShopGrid from './_components/ShopGrid';
import { getProducts } from '@/actions/products';

export const metadata: Metadata = {
  title: 'Shop | Geuza',
  description:
    'Shop our full range of affordable assistive mobility devices — wheelchairs, crutches, walking aids, and prosthetics made from repurposed e-waste.',
};

export default async function ShopPage() {
  const raw = await getProducts({ visible: true });
  const products = raw.map((p) => ({ ...p, price: Number(p.price) }));

  return (
    <>
      <Header />
      <main>
        <ShopHero />
        <ShopGrid products={products} />
      </main>
      <Footer />
    </>
  );
}
