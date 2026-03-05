export default function MissionVision() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 divide-y md:divide-y-0 md:divide-x divide-gray-100">

          {/* Mission */}
          <div className="text-center pt-8 md:pt-0 md:pr-10">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">
              Mission
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              At Geuza, our mission is to transform lives by designing smart, affordable
              mobility devices that combines sustainable materials with advanced technology.
              We are committed to making mobility accessible, safe, and empowering ensuring
              every product we create delivers purpose-driven impact for those who need it most.
            </p>
          </div>

          {/* Vision */}
          <div className="text-center pt-8 md:pt-0 md:pl-10">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">
              Vision
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              At Geuza, we envision an inclusive Africa where innovation, sustainability,
              and technology converge to transform mobility. We are committed to restoring
              that independence through every breakthrough assistive device we design.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
