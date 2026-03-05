import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import ProductsHero from './_components/ProductsHero';
import ProductsGrid from './_components/ProductsGrid';

export const metadata: Metadata = {
  title: 'Products | Geuza',
  description:
    'Browse our full range of affordable, sustainable assistive mobility devices — wheelchairs, crutches, walking aids, and prosthetics made from repurposed e-waste.',
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        <ProductsHero />
        <ProductsGrid />
      </main>
      <Footer />
    </>
  );
}
