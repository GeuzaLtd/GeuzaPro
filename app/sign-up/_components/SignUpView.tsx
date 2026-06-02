'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { registerAction } from '@/actions/auth';
import { signIn } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';

const PERKS = [
  { label: 'Track every order & donation'      },
  { label: 'Access exclusive product drops'    },
  { label: 'Join a community changing lives'   },
];

const fieldVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.5 },
  }),
};

function getStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/\d/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: [string, string][] = [
    ['', ''],
    ['Weak',   '#ef4444'],
    ['Fair',   '#FF7900'],
    ['Good',   '#eab308'],
    ['Strong', '#0F9E59'],
  ];
  return { level: score, label: map[score][0], color: map[score][1] };
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function SignUpView() {
  const [form, setForm]           = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw,   setShowPw]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [agreed,   setAgreed]     = useState(false);
  const [status,   setStatus]     = useState<'idle' | 'loading' | 'success'>('idle');
  const [errors,   setErrors]     = useState<Record<string, string>>({});

  const strength = getStrength(form.password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2)                         e.name     = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))     e.email    = 'Please enter a valid email.';
    if (form.password.length < 8)                            e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirm)                      e.confirm  = 'Passwords do not match.';
    if (!agreed)                                             e.terms    = 'Please accept the terms to continue.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    const result = await registerAction({ name: form.name, email: form.email, password: form.password });
    if (!result.success) {
      setErrors({ email: result.error ?? 'Registration failed.' });
      setStatus('idle');
      return;
    }
    setStatus('success');
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  return (
    <div className="min-h-screen flex">

      {/* ══════════════════════════════════════════
          LEFT — Branded panel (hidden on mobile)
      ══════════════════════════════════════════ */}
      <div
        className="hidden lg:flex w-[45%] relative flex-col overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #006D2C 0%, #0F9E59 55%, #1cb86c 100%)' }}
      >
        {/* Dot-grid decoration */}
        <div
          className="absolute top-10 right-12 grid grid-cols-5 gap-2 opacity-[0.18] pointer-events-none select-none"
          aria-hidden="true"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="w-[5px] h-[5px] rounded-full bg-white block" />
          ))}
        </div>

        {/* Glow rings behind crutch */}
        <div
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          aria-hidden="true"
        />
        <div
          className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          aria-hidden="true"
        />

        {/* Crutch image */}
        <div
          className="absolute right-0 xl:right-[-10px] top-1/2 -translate-y-[54%] w-[200px] xl:w-[230px] h-[380px] xl:h-[430px] pointer-events-none"
          aria-hidden="true"
        >
          <Image
            src="/images/hero-image2.png"
            alt=""
            fill
            className="object-contain"
            style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.40))' }}
            priority
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Geuza Logo"
                width={100}
                height={30}
                className="object-contain"
              />
            </Link>
          </motion.div>

          {/* Centre copy */}
          <div className="flex-1 flex flex-col justify-center max-w-[58%]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 mb-6 w-fit">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                  Get Started Free
                </span>
              </div>

              <h2 className="font-display font-black text-white text-[1.9rem] xl:text-[2.15rem] leading-tight mb-5">
                Join the movement.<br />
                <span className="text-secondary">Be the change.</span>
              </h2>

              <p className="text-white/65 text-sm leading-relaxed mb-8">
                Create your free account and become part of a community turning
                e-waste into assistive devices that restore dignity and independence.
              </p>

              {/* Perks */}
              <ul className="flex flex-col gap-3">
                {PERKS.map((p, i) => (
                  <motion.li
                    key={p.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.12 }}
                    className="flex items-center gap-3 text-white/70 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-secondary/90 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {p.label}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom social-proof badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-3 bg-white/[0.08] border border-white/15 rounded-2xl px-5 py-4 backdrop-blur-sm self-start"
          >
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white/20"
                  style={{ background: `linear-gradient(135deg, #0F9E59 0%, #1bc870 100%)` }}
                />
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-bold">147 donors this month</p>
              <p className="text-white/45 text-xs">making real impact</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Form panel
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-white min-w-0 overflow-y-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100 flex-shrink-0">
          <Link href="/" className="lg:hidden">
            <Image
              src="/images/logo.png"
              alt="Geuza Logo"
              width={90}
              height={28}
              className="object-contain"
            />
          </Link>
          <Link
            href="/"
            className="ml-auto flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center px-5 sm:px-8 py-10">
          <div className="w-full max-w-[420px]">

            <AnimatePresence mode="wait">
              {status === 'success' ? (

                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.35 }}
                  className="flex flex-col items-center text-center gap-5 py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', bounce: 0.5 }}
                    className="w-20 h-20 rounded-full bg-primary shadow-xl shadow-primary/25 flex items-center justify-center"
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="font-display font-black text-gray-900 text-2xl mb-2">Account Created!</h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Welcome to Geuza,{' '}
                      <span className="font-semibold text-gray-700">{form.name.split(' ')[0]}</span>!
                      {' '}A confirmation email has been sent to{' '}
                      <span className="font-medium">{form.email}</span>.
                    </p>
                  </div>
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-8 py-3 rounded-full hover:bg-[#005523] transition-colors"
                  >
                    Sign In to Your Account
                  </Link>
                </motion.div>

              ) : (

                /* ── Registration form ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65 }}
                >
                  <div className="mb-7">
                    <motion.div
                      custom={0} variants={fieldVariants} initial="hidden" animate="visible"
                      className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 mb-5"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-primary text-xs font-bold tracking-widest uppercase">Get Started Free</span>
                    </motion.div>

                    <motion.h1
                      custom={1} variants={fieldVariants} initial="hidden" animate="visible"
                      className="font-display font-black text-gray-900 text-4xl mb-2"
                    >
                      Create Account
                    </motion.h1>
                    <motion.p
                      custom={2} variants={fieldVariants} initial="hidden" animate="visible"
                      className="text-gray-500 text-sm"
                    >
                      Already have an account?{' '}
                      <Link href="/sign-in" className="text-primary font-semibold hover:underline">
                        Sign In
                      </Link>
                    </motion.p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Full Name */}
                    <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={set('name')}
                        placeholder="e.g. Jean-Paul Habimana"
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-primary/10'}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </motion.div>

                    {/* Email */}
                    <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={set('email')}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-primary/10'}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </motion.div>

                    {/* Password */}
                    <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPw ? 'text' : 'password'}
                          required
                          value={form.password}
                          onChange={set('password')}
                          placeholder="Min. 8 characters"
                          className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-primary/10'}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={showPw ? 'Hide password' : 'Show password'}
                        >
                          <EyeIcon open={showPw} />
                        </button>
                      </div>
                      {form.password && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex gap-1 flex-1">
                            {[1, 2, 3, 4].map((n) => (
                              <motion.div
                                key={n}
                                className="h-1.5 flex-1 rounded-full"
                                animate={{ backgroundColor: strength.level >= n ? strength.color : '#e5e7eb' }}
                                transition={{ duration: 0.3 }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold" style={{ color: strength.color }}>
                            {strength.label}
                          </span>
                        </div>
                      )}
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </motion.div>

                    {/* Confirm password */}
                    <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConf ? 'text' : 'password'}
                          required
                          value={form.confirm}
                          onChange={set('confirm')}
                          placeholder="Re-enter your password"
                          className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.confirm ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-primary/10'}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConf(!showConf)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={showConf ? 'Hide password' : 'Show password'}
                        >
                          <EyeIcon open={showConf} />
                        </button>
                      </div>
                      {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                    </motion.div>

                    {/* Terms */}
                    <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative mt-0.5 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => {
                              setAgreed(e.target.checked);
                              if (errors.terms) setErrors((p) => { const n = { ...p }; delete n.terms; return n; });
                            }}
                            className="sr-only"
                          />
                          <motion.div
                            animate={{
                              backgroundColor: agreed ? '#006D2C' : '#fff',
                              borderColor: agreed ? '#006D2C' : errors.terms ? '#ef4444' : '#d1d5db',
                            }}
                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors"
                          >
                            {agreed && (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </motion.div>
                        </div>
                        <span className="text-sm text-gray-500 leading-snug">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary font-medium hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy-policy" className="text-primary font-medium hover:underline">Privacy Policy</Link>
                        </span>
                      </label>
                      {errors.terms && <p className="text-red-500 text-xs mt-1 ml-8">{errors.terms}</p>}
                    </motion.div>

                    {/* Submit */}
                    <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible" className="pt-1">
                      <motion.button
                        type="submit"
                        disabled={status === 'loading'}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-[#005523] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                        {status === 'loading' ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                            Creating account…
                          </span>
                        ) : 'Create Account'}
                      </motion.button>
                    </motion.div>

                    {/* Google */}
                    <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible">
                      <div className="flex items-center gap-3 my-1">
                        <span className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400 font-medium">or sign up with</span>
                        <span className="flex-1 h-px bg-gray-100" />
                      </div>
                      <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mt-2"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </button>
                    </motion.div>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-5 border-t border-gray-100 text-center flex-shrink-0">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Geuza. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
