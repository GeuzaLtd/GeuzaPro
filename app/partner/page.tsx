import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import PartnerForm from './_components/PartnerForm';

export const metadata: Metadata = {
  title: 'Partner With Us — Geuza',
  description:
    'Partner with Geuza to deliver affordable assistive devices across Africa. We work with NGOs, government agencies, hospitals, and corporate sponsors.',
};

const PARTNERSHIP_MODELS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Bulk Procurement',
    desc:  'Source assistive devices at scale for your beneficiaries, clinics, or government programmes.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Co-funded Distribution',
    desc:  'Co-fund a distribution programme targeting specific communities or regions across Africa.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Financial Sponsorship',
    desc:  'Sponsor device production and reach people who cannot afford assistive technology.',
  },
];

export default function PartnerPage() {
  return (
    <>
      <Header />
      <main>

        {/* Hero */}
        <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-black text-white/[0.04] text-[22vw] leading-none tracking-tighter uppercase font-display">
              PARTNER
            </span>
          </span>
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              Work With Us
            </span>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-4">
              Partner With Geuza
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              Join organisations across Africa working with us to make assistive technology accessible
              for everyone who needs it.
            </p>
          </div>
        </section>

        {/* Partnership models */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-gray-900 text-3xl mb-3">Ways to Partner</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Whether you are an NGO, hospital, government body, or corporation, there is a partnership model for you.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {PARTNERSHIP_MODELS.map((m) => (
                <div key={m.title} className="border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {m.icon}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-base mb-2">{m.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
              <div className="mb-8">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
                  Partnership Inquiry
                </span>
                <h2 className="font-display font-black text-gray-900 text-3xl mb-2">Get in Touch</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Fill in the form below and our partnerships team will reach out within 2–3 business days.
                </p>
              </div>
              <PartnerForm />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
