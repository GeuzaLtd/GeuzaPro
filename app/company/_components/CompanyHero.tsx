import Image from 'next/image';

export default function CompanyHero() {
  return (
    <section className="relative bg-gray-900 min-h-[480px] md:min-h-[560px] flex items-center justify-center overflow-hidden">

      {/* Large GEUZA watermark */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display font-black text-[#0F9E59]/15 text-[22vw] leading-none tracking-tighter uppercase">
          GEUZA
        </span>
      </span>

      {/* Crutches — left */}
      <div className="absolute left-0 bottom-0 w-[18%] h-[85%] pointer-events-none">
        <Image
          src="/images/products/crutches.png"
          alt=""
          fill
          className="object-contain object-bottom opacity-60"
          unoptimized
        />
      </div>

      {/* Wheelchair person — right */}
      <div className="absolute right-0 bottom-0 w-[26%] h-[90%] pointer-events-none">
        <Image
          src="/images/hero-image.png"
          alt=""
          fill
          className="object-contain object-bottom opacity-60"
          unoptimized
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p className="text-[#FF7900] font-semibold tracking-[0.2em] uppercase text-sm mb-3">
          Old but still Gold
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
          Smart, Affordable, and<br />
          Sustainable Assistive Devices
        </h1>
        <span className="inline-block bg-[#0F9E59] text-white font-bold tracking-[0.18em] uppercase text-xs px-8 py-3 rounded-md">
          About Us
        </span>
      </div>
    </section>
  );
}
