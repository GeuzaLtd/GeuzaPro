'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TIERS = [
  { amount: 5000, label: '5,000 Frw', impact: 'Provides a pair of forearm crutches to help someone walk again.' },
  { amount: 10000, label: '10,000 Frw', impact: 'Funds materials for one custom walking aid, hand-crafted from recycled e-waste.' },
  { amount: 25000, label: '25,000 Frw', impact: 'Covers the full cost of a rollator walker with adjustable settings.' },
  { amount: 50000, label: '50,000 Frw', impact: 'Contributes toward a complete standard wheelchair for daily mobility.' },
  { amount: 100000, label: '100,000 Frw', impact: 'Fully funds an advanced prosthetic limb — giving someone a second chance at life.' },
];

type FormState = 'idle' | 'loading' | 'success';

export default function DonateSection() {
  const [selected, setSelected] = useState<number | null>(10000);
  const [custom, setCustom] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<FormState>('idle');

  const effectiveAmount = custom ? Number(custom.replace(/\D/g, '')) : selected;
  const currentTier = TIERS.find((t) => t.amount === effectiveAmount);
  const displayAmount = custom
    ? `${Number(custom.replace(/\D/g, '')).toLocaleString()} Frw`
    : TIERS.find((t) => t.amount === selected)?.label ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1800));
    setStatus('success');
  };

  return (
    <section id="donate-form" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase mb-3">Choose Your Impact</p>
          <h2 className="font-display font-black text-gray-900 text-3xl md:text-4xl mb-4">
            Every Franc Counts
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Select a donation amount below and see exactly how your generosity translates into real, life-changing devices.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ── Left: Amount picker ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
          >
            <h3 className="font-display font-bold text-gray-900 text-xl mb-6">Select Amount</h3>

            {/* Preset tiers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {TIERS.map((tier) => {
                const isActive = selected === tier.amount && !custom;
                return (
                  <motion.button
                    key={tier.amount}
                    onClick={() => { setSelected(tier.amount); setCustom(''); }}
                    whileTap={{ scale: 0.96 }}
                    className={`relative rounded-xl py-3 px-2 text-sm font-bold transition-all duration-200 border-2 overflow-hidden ${
                      isActive
                        ? 'border-[#0F9E59] text-[#0F9E59] bg-[#0F9E59]/5'
                        : 'border-gray-100 text-gray-600 bg-gray-50 hover:border-[#0F9E59]/40 hover:text-[#0F9E59]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tier-bg"
                        className="absolute inset-0 bg-[#0F9E59]/8 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative">{tier.label}</span>
                  </motion.button>
                );
              })}

              {/* Custom */}
              <div className={`col-span-2 sm:col-span-3 rounded-xl border-2 transition-all duration-200 ${
                custom ? 'border-[#0F9E59]' : 'border-gray-100'
              }`}>
                <div className="relative flex items-center">
                  <span className="pl-4 text-gray-400 text-sm font-semibold flex-shrink-0">Frw</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter custom amount"
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value.replace(/\D/g, '')); setSelected(null); }}
                    className="flex-1 py-3 px-3 text-sm text-gray-700 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Impact description */}
            <div className="min-h-[80px] flex items-start">
              <AnimatePresence mode="wait">
                {currentTier && (
                  <motion.div
                    key={currentTier.amount}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 bg-[#0F9E59]/5 border border-[#0F9E59]/20 rounded-xl p-4"
                  >
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#0F9E59] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-bold text-[#0F9E59]">{currentTier.label} </span>
                      {currentTier.impact}
                    </p>
                  </motion.div>
                )}
                {!currentTier && custom && Number(custom) > 0 && (
                  <motion.div
                    key="custom-msg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 bg-[#FF7900]/5 border border-[#FF7900]/20 rounded-xl p-4"
                  >
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#FF7900] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Your generous custom donation of{' '}
                      <span className="font-bold text-[#FF7900]">{Number(custom).toLocaleString()} Frw </span>
                      will go directly toward building assistive devices for those in need. Thank you!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quote */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-gray-400 text-sm italic leading-relaxed">
                &ldquo;A single wheelchair can transform a person&apos;s entire world — their ability to work, to move freely, to live with dignity.&rdquo;
              </p>
              <p className="text-gray-500 text-xs font-semibold mt-2">— Geuza Team</p>
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', bounce: 0.5, duration: 0.6 }}
                    className="w-20 h-20 rounded-full bg-[#0F9E59] flex items-center justify-center shadow-lg shadow-[#0F9E59]/30"
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="font-display font-black text-gray-900 text-2xl mb-2">Thank You, {form.name.split(' ')[0]}!</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Your donation of <span className="font-bold text-[#0F9E59]">{displayAmount}</span> is making a real difference. We&apos;ll send a confirmation to <span className="font-medium">{form.email}</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', message: '' }); setCustom(''); setSelected(10000); }}
                    className="text-sm text-[#0F9E59] font-semibold hover:underline"
                  >
                    Make another donation
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-gray-900 text-xl">Your Information</h3>
                    {displayAmount && (
                      <span className="bg-[#0F9E59]/10 text-[#0F9E59] text-sm font-bold px-3 py-1 rounded-full">
                        {displayAmount}
                      </span>
                    )}
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Jean-Paul Habimana"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+250 7XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message <span className="text-gray-300 font-normal normal-case">(optional)</span></label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Share why you're donating…"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || !effectiveAmount}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full py-4 rounded-xl bg-[#0F9E59] text-white font-bold text-sm overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#0d8a4d] transition-colors duration-300"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        Processing…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Donate {displayAmount && `· ${displayAmount}`}
                      </span>
                    )}
                  </motion.button>

                  <p className="text-center text-gray-400 text-xs">
                    Your information is secure and will never be shared.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
