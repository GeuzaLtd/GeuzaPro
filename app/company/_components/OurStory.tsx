import Image from 'next/image';

export default function OurStory() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: text + stats */}
          <div className="flex-1 space-y-6">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full">
              Our Story
            </span>

            <h2 className="font-display font-black text-gray-900 text-4xl md:text-5xl leading-tight">
              We turn{' '}
              <span className="text-primary">e-waste</span>{' '}
              into devices that{' '}
              <span className="text-secondary">transform lives.</span>
            </h2>

            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
              Geuza is a Swahili word meaning &ldquo;transform&rdquo;. It&apos;s an African company that
              engineers smart, affordable assistive technologies from electronic waste,
              expanding access for people living with disabilities, injuries, aging-related
              conditions, and chronic illnesses while reducing environmental harm.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-2">
              <div>
                <p className="text-4xl font-display font-black text-primary">500+</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Devices created</p>
              </div>
              <div className="border-l border-gray-100 pl-8">
                <p className="text-4xl font-display font-black text-primary">900+</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">E-waste items recycled</p>
              </div>
              <div className="border-l border-gray-100 pl-8">
                <p className="text-4xl font-display font-black text-primary">65+</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Lives empowered</p>
              </div>
            </div>
          </div>

          {/* Right: product card */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="relative bg-primary/8 rounded-3xl flex items-center justify-center p-6 h-[420px] overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent" />
              <Image
                src="/images/products/crutches.png"
                alt="Geuza Crutches — Current Product"
                width={240}
                height={360}
                className="object-contain drop-shadow-xl relative z-10"
                unoptimized
              />
              <div className="absolute bottom-5 left-5 bg-white rounded-xl px-4 py-2.5 shadow-md z-10">
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Current Product</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">Geuza Crutches</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
