import { Header, Footer } from '@/components';
import CartView from './_components/CartView';

export const metadata = {
  title: 'Your Cart',
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h1 className="font-display font-black text-gray-900 text-3xl md:text-4xl mb-8">
            Your Cart
          </h1>
          <CartView />
        </div>
      </main>
      <Footer />
    </>
  );
}
