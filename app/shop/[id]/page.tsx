import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components';
import { getProductById } from '@/actions/products';
import ProductDetail from './_components/ProductDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return {};
  return {
    title: `${product.name} | Geuza Shop`,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const raw = await getProductById(Number(id));
  if (!raw || !raw.isVisible) notFound();
  const product = { ...raw, price: Number(raw.price) };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
