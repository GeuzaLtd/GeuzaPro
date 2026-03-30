import Image from 'next/image';

const STEPS = [
  {
    num: 1,
    label: 'Step 1 — Material Research & Sourcing',
    title: 'Turning waste into engineering-grade materials',
    body: 'Our journey began with testing recovered electronic plastics and components to understand their strength, durability, and structural potential. Through materials research and testing, we confirmed that recycled e-waste meets the standards required for assistive device manufacturing.',
    image: '/images/images/step1.jpeg',
    alt: 'Testing raw recycled material',
    accent: false,
  },
  {
    num: 2,
    label: 'Step 2 — The First Prototype',
    title: 'Proof that circular engineering works',
    body: 'Our prototype was built from salvaged materials recovered from discarded electronics. Simple but functional, it demonstrated that recycled components could be engineered into reliable assistive devices capable of supporting real human use.',
    image: '/images/images/step2.jpeg',
    alt: 'First prototype',
    accent: false,
  },
  {
    num: 3,
    label: 'Step 3 — Product Development & Manufacturing',
    title: 'From prototype to real production',
    body: 'With successful prototypes, Geuza transitioned into structured product development and manufacturing. Our team refined designs, improved material processing, and prepared production of assistive devices that meet quality, durability, and usability standards.',
    image: '/images/images/step3.jpeg',
    alt: 'Production workshop',
    accent: false,
  },
  {
    num: 4,
    label: 'Step 4 — Smart Assistive Technology',
    title: 'Engineering the next generation of assistive solutions',
    body: 'Geuza began developing smart assistive devices, starting from smart crutches enhanced with connected technology, opening new possibilities for improved rehabilitation insights and future healthcare integration.',
    image: '/images/images/step4.jpeg',
    alt: 'Smart assistive technology',
    accent: false,
  },
  {
    num: 5,
    label: 'Step 5 — Trusted Partnerships & Recognition',
    title: 'Working with institutions shaping innovation and standards',
    body: 'Geuza collaborates with leading institutions and partners, including Carnegie Mellon University Africa (CMU), Rwanda Standards Board (RSB), Rwanda FDA, UNDP through the Timbuktoo HealthTech Program, the Government of Rwanda through Hanga Pitchfest, BPN Rwanda, Enviroserve Rwanda, and Unipod — strengthening our technology, standards, and scalable growth across Africa.',
    image: '/images/images/step5.jpeg',
    alt: 'Partners and recognition',
    accent: true,
  },
];

export default function OurJourney() {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full">
            Our Journey So Far
          </span>
          <h2 className="font-display font-black text-gray-900 text-3xl md:text-4xl">
            From an idea into a manufacturing company
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {STEPS.map((step, idx) => (
            <div key={step.num}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                {/* Number circle */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full font-display font-black text-white text-lg flex items-center justify-center shadow-md ${
                    step.accent ? 'bg-secondary' : 'bg-primary'
                  }`}
                >
                  {step.num}
                </div>

                {/* Image */}
                <div className="relative w-full md:w-64 h-52 rounded-2xl overflow-hidden shadow flex-shrink-0">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover object-center"
                    unoptimized
                  />
                </div>

                {/* Text */}
                <div className="flex-1 space-y-2">
                  <p className="text-secondary text-[11px] font-bold uppercase tracking-[0.15em]">
                    {step.label}
                  </p>
                  <h3 className="font-display font-bold text-gray-900 text-xl md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div className="border-l-2 border-dashed border-primary/25 h-10 ml-6 mt-2" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
