import Image from 'next/image';

export default function FoundingIdea() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Image */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/images/company.png"
              alt="Transforming E-Waste into Empowerment"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 space-y-6">
          <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full">
            Our founding idea
          </span>

          <blockquote className="font-display font-black text-primary text-2xl md:text-3xl leading-snug">
            &ldquo;What if the electronics discarded today could power the assistive technologies of tomorrow?&rdquo;
          </blockquote>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            GEUZA was born from a bold insight: the devices we throw away still contain valuable
            materials and untapped potential. Through circular engineering and advanced design,
            these resources can be transformed into high-quality assistive technologies at a
            fraction of the traditional cost.
          </p>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            That insight became a company. Today, GEUZA is building a new generation of smart,
            sustainable assistive technologies designed to expand access across Africa and beyond.
          </p>
        </div>

      </div>
    </section>
  );
}
