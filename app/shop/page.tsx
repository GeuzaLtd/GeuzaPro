import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import ShopHero from './_components/ShopHero';
import ShopGrid from './_components/ShopGrid';

export const metadata: Metadata = {
  title: 'Shop | Geuza',
  description:
    'Shop our full range of affordable assistive mobility devices — wheelchairs, crutches, walking aids, and prosthetics made from repurposed e-waste.',
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <ShopHero />
        <ShopGrid />
      </main>
      <Footer />
    </>
  );
}
