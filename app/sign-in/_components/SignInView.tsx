'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loginAction } from '@/actions/auth';
import { signIn } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';

const STATS = [
  { value: '500+', label: 'Devices' },
  { value: '65+',  label: 'Lives'   },
  { value: '15',   label: 'Partners'},
];

const fieldVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.5 },
  }),
};

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

export default function SignInView() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success'>('idle');
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('loading');
    const result = await loginAction(email, password);
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      setStatus('idle');
      return;
    }
    setStatus('success');
    const dest = result.role === 'admin' ? '/dashboard' : '/';
    setTimeout(() => router.push(dest), 2000);
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

        {/* Crutch image — floats on the right half of the panel */}
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

          {/* Centre copy — constrained width so it doesn't slide under the crutch */}
          <div className="flex-1 flex flex-col justify-center max-w-[58%]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 mb-6 w-fit">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                  Assistive Technology
                </span>
              </div>

              <h2 className="font-display font-black text-white text-[1.9rem] xl:text-[2.15rem] leading-tight mb-5">
                Smart devices<br />for a life<br />
                <span className="text-secondary">without limits.</span>
              </h2>

              <p className="text-white/65 text-sm leading-relaxed">
                Sign in to manage your orders, track your donations, and stay connected
                with the Geuza community.
              </p>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-3"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex-1 bg-white/[0.08] border border-white/15 rounded-2xl px-3 py-4 text-center backdrop-blur-sm"
              >
                <p className="font-display font-black text-white text-2xl">{s.value}</p>
                <p className="text-white/45 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Form panel
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-white min-w-0">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100 flex-shrink-0">
          {/* Logo — visible only on mobile */}
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
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 overflow-y-auto">
          <div className="w-full max-w-[420px]">

            <AnimatePresence mode="wait">
              {status === 'success' ? (

                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.35 }}
                  className="flex flex-col items-center text-center gap-5 py-10"
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
                    <h2 className="font-display font-black text-gray-900 text-2xl mb-2">Welcome Back!</h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      You&apos;re signed in as{' '}
                      <span className="font-semibold text-gray-700">{email}</span>.
                      Redirecting you now…
                    </p>
                  </div>
                  <motion.div className="w-40 h-1 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, ease: 'linear', delay: 0.4 }}
                    />
                  </motion.div>
                </motion.div>

              ) : (

                /* ── Sign-in form ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65 }}
                >
                  {/* Heading */}
                  <div className="mb-8">
                    <motion.div
                      custom={0} variants={fieldVariants} initial="hidden" animate="visible"
                      className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 mb-5"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-primary text-xs font-bold tracking-widest uppercase">Welcome Back</span>
                    </motion.div>

                    <motion.h1
                      custom={1} variants={fieldVariants} initial="hidden" animate="visible"
                      className="font-display font-black text-gray-900 text-4xl mb-2"
                    >
                      Sign In
                    </motion.h1>
                    <motion.p
                      custom={2} variants={fieldVariants} initial="hidden" animate="visible"
                      className="text-gray-500 text-sm"
                    >
                      Don&apos;t have an account?{' '}
                      <Link href="/sign-up" className="text-primary font-semibold hover:underline">
                        Create one
                      </Link>
                    </motion.p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Email */}
                    <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </motion.div>

                    {/* Password */}
                    <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Password
                        </label>
                        <Link href="#" className="text-xs text-primary font-medium hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={showPw ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
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
                    </motion.div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
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
                            Signing in…
                          </span>
                        ) : 'Sign In'}
                      </motion.button>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                      custom={6} variants={fieldVariants} initial="hidden" animate="visible"
                      className="flex items-center gap-3"
                    >
                      <span className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs text-gray-400 font-medium">or continue with</span>
                      <span className="flex-1 h-px bg-gray-100" />
                    </motion.div>

                    {/* Google */}
                    <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                      <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
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
