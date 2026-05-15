import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import FAQAccordions from './_components/FAQAccordions';

export const metadata: Metadata = {
  title: 'FAQ | Geuza',
  description: 'Frequently asked questions about Geuza, our assistive devices, ordering, donations, and partnerships.',
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-black text-white/5 text-[28vw] leading-none tracking-tighter uppercase">FAQ</span>
          </span>
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">Help Center</span>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-4">Frequently Asked Questions</h1>
            <p className="text-white/50 text-base leading-relaxed">
              Everything you need to know about Geuza, our devices, ordering, and how to get involved.
            </p>
          </div>
        </section>

        {/* FAQ accordion — client component */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <FAQAccordions />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
