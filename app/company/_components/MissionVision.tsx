const VALUES = [
  'Promote Environmental Sustainability',
  'Empower People with Disabilities Through Innovation',
  'Scale Ethical Production of Assistive Technology',
];

export default function MissionVision() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* Header */}
        <div className="text-center">
          <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full">
            What drives us
          </span>
        </div>

        {/* Mission + Vision */}
        <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

          {/* Mission */}
          <div className="flex-1 space-y-4 pb-10 lg:pb-0 lg:pr-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-display font-black text-gray-900 text-xl uppercase tracking-wide">Mission</h3>
            </div>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              To transform lives by designing smart, affordable assistive devices that combine
              sustainable recycled materials with advanced technology — making devices accessible,
              safe, and empowering for those who need it most.
            </p>
          </div>

          {/* Vision */}
          <div className="flex-1 space-y-4 pt-10 lg:pt-0 lg:pl-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="font-display font-black text-gray-900 text-xl uppercase tracking-wide">Vision</h3>
            </div>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              An inclusive Africa where innovation, sustainability, and technology converge to
              transform lives — restoring independence through every breakthrough assistive
              device we design.
            </p>
          </div>

        </div>

        {/* Values */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Our Values</p>
          <div className="flex flex-wrap gap-3">
            {VALUES.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                {v}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
