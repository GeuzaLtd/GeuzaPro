import Image from 'next/image';
import Link from 'next/link';

export default function BlogHero() {
  return (
    <section className="relative h-[280px] md:h-[360px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/images/hero.png"
          alt="Geuza blog"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />
      </div>

      <div className="relative z-10 text-center px-4">
        <p className="text-white/50 text-xs tracking-[0.25em] uppercase mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {' '}&rsaquo;{' '}
          <span className="text-white/80">Blog</span>
        </p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-[0.08em]">
          Blog
        </h1>
        <div className="w-14 h-1 bg-[#0F9E59] mx-auto mt-5 rounded-full" />
      </div>
    </section>
  );
}
