export default function OurStory() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl">

          {/* Text + stats */}
          <div className="space-y-6">
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

        </div>
      </div>
    </section>
  );
}
