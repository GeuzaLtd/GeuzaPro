export default function TheProblem() {
  return (
    <section className="w-full bg-primary py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
          The problem we solve
        </span>
        <h2 className="font-display font-black text-white text-3xl md:text-5xl leading-tight">
          Two Growing Crises.<br className="hidden md:block" /> One Untapped Opportunity.
        </h2>
        <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Africa generates more than 2.9 million tonnes of electronic waste every year,
          while over half of those who need assistive technologies still lack access to them.
          Two challenges growing side by side — that&apos;s where GEUZA comes in.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
          <div className="bg-white/10 rounded-2xl px-8 py-5 flex-1 max-w-[240px] mx-auto sm:mx-0">
            <p className="font-display font-black text-white text-3xl">2.9M+</p>
            <p className="text-white/70 text-sm mt-1">tonnes of e-waste generated<br />in Africa annually</p>
          </div>
          <div className="bg-white/10 rounded-2xl px-8 py-5 flex-1 max-w-[240px] mx-auto sm:mx-0">
            <p className="font-display font-black text-white text-3xl">50%+</p>
            <p className="text-white/70 text-sm mt-1">of those who need assistive<br />tech still lack access</p>
          </div>
        </div>
      </div>
    </section>
  );
}
