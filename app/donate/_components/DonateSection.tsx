'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { createDonation } from '@/actions/donations';

const CURRENCIES = [
  { code: 'RWF', symbol: 'RWF', format: (n: number) => `${n.toLocaleString()} RWF` },
  { code: 'USD', symbol: '$',   format: (n: number) => `$${n.toLocaleString()}` },
  { code: 'EUR', symbol: '€',   format: (n: number) => `€${n.toLocaleString()}` },
];

const DEVICE_TAGS = [
  'Wheelchairs', 'Crutches', 'Prosthetics',
  'Hearing Aids', 'Walking Aids', 'Vision Aids',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function DonateSection() {
  const { data: session } = useSession();
  const sessionApplied = useRef(false);

  const [currency, setCurrency] = useState('RWF');
  const [amount, setAmount]     = useState('');
  const [form, setForm]         = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus]     = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isAuth       = !!session?.user;
  const authName     = session?.user?.name  ?? '';
  const authEmail    = session?.user?.email ?? '';

  useEffect(() => {
    if (session?.user && !sessionApplied.current) {
      setForm((prev) => ({
        ...prev,
        name:  authName  || prev.name,
        email: authEmail || prev.email,
      }));
      sessionApplied.current = true;
    }
  }, [session, authName, authEmail]);

  const numericAmount    = Number(amount.replace(/\D/g, '')) || 0;
  const selectedCurrency = CURRENCIES.find((c) => c.code === currency)!;
  const displayAmount    = numericAmount > 0 ? selectedCurrency.format(numericAmount) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numericAmount) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await createDonation({
        donorName: form.name,
        email:     form.email,
        phone:     form.phone  || undefined,
        amount:    numericAmount,
        currency,
        message:   form.message || undefined,
        userId:    isAuth ? Number(session!.user!.id) : undefined,
      });

      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(result.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setAmount('');
    setErrorMsg('');
    setForm((prev) =>
      isAuth
        ? { ...prev, phone: '', message: '' }
        : { name: '', email: '', phone: '', message: '' }
    );
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
          <p className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase mb-3">Make a Donation</p>
          <h2 className="font-display font-black text-gray-900 text-3xl md:text-4xl mb-4">
            Every Contribution Counts
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Enter your amount, fill in your details, and the Geuza team will reach out to guide you through the next steps.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ── Left: amount + context ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
          >
            <h3 className="font-display font-bold text-gray-900 text-xl mb-6">Your Donation</h3>

            {/* Currency selector */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Currency</p>
              <div className="flex gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                      currency === c.code
                        ? 'border-[#0F9E59] bg-[#0F9E59] text-white'
                        : 'border-gray-100 text-gray-500 hover:border-[#0F9E59]/40 hover:text-[#0F9E59]'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div className="mb-7">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amount</p>
              <div
                className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-4 transition-all duration-200 ${
                  amount ? 'border-[#0F9E59] bg-white' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <span className="text-gray-400 text-sm font-bold flex-shrink-0 min-w-[2rem]">
                  {selectedCurrency.symbol}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 text-2xl font-black text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-200 placeholder:font-normal placeholder:text-lg"
                />
              </div>
            </div>

            {/* Device tags */}
            <div className="mb-7">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your gift supports</p>
              <div className="flex flex-wrap gap-2">
                {DEVICE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-[#0F9E59]/8 text-[#0F9E59] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#0F9E59]/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F9E59] flex-shrink-0" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact statement */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-gray-500 text-sm leading-relaxed">
                Every donation, large or small, funds the design and production of assistive devices crafted
                from recycled e-waste, reaching people with disabilities across Africa.
              </p>
              <p className="text-[#0F9E59] text-xs font-bold mt-3 uppercase tracking-wider">Geuza</p>
            </div>
          </motion.div>

          {/* ── Right: form ── */}
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
                  className="flex flex-col items-center justify-center text-center py-10 gap-5"
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
                    <h3 className="font-display font-black text-gray-900 text-2xl mb-2">
                      Thank You, {form.name.split(' ')[0]}!
                    </h3>
                    {displayAmount && (
                      <div className="inline-flex items-center gap-2 bg-[#0F9E59]/10 text-[#0F9E59] font-bold text-sm px-4 py-1.5 rounded-full mb-4">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {displayAmount}
                      </div>
                    )}
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      We have received your donation interest and sent a confirmation to{' '}
                      <span className="font-semibold text-gray-700">{form.email}</span>.
                      The Geuza team will be in touch shortly to walk you through the next steps.
                    </p>
                  </div>

                  <button
                    onClick={reset}
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

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                      {isAuth && authName && (
                        <span className="ml-2 text-[#0F9E59] font-normal normal-case tracking-normal">from your account</span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      readOnly={isAuth && !!authName}
                      placeholder="e.g. Jean-Paul Habimana"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 focus:outline-none transition-all ${
                        isAuth && authName
                          ? 'border-gray-100 bg-gray-50 text-gray-500 cursor-default'
                          : 'border-gray-200 focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                      {isAuth && authEmail && (
                        <span className="ml-2 text-[#0F9E59] font-normal normal-case tracking-normal">from your account</span>
                      )}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      readOnly={isAuth && !!authEmail}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 focus:outline-none transition-all ${
                        isAuth && authEmail
                          ? 'border-gray-100 bg-gray-50 text-gray-500 cursor-default'
                          : 'border-gray-200 focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10'
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Phone Number{' '}
                      <span className="text-gray-300 font-normal normal-case tracking-normal">(optional)</span>
                    </label>
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
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Message{' '}
                      <span className="text-gray-300 font-normal normal-case tracking-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Share why you are donating..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all resize-none"
                    />
                  </div>

                  {/* Error banner */}
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || !numericAmount}
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
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Donate{displayAmount ? ` · ${displayAmount}` : ''}
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
