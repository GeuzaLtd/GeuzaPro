'use client';

import { useState } from 'react';
import { createMessage } from '@/actions/messages';

const PARTNERSHIP_TYPES = [
  { value: 'procurement',    label: 'Bulk Procurement' },
  { value: 'distribution',   label: 'Co-funded Distribution' },
  { value: 'sponsorship',    label: 'Financial Sponsorship' },
  { value: 'research',       label: 'Research & Development' },
  { value: 'other',          label: 'Other' },
];

const ORG_TYPES = [
  { value: 'ngo',        label: 'NGO / Non-profit' },
  { value: 'government', label: 'Government Agency' },
  { value: 'hospital',   label: 'Hospital / Health Facility' },
  { value: 'corporate',  label: 'Corporate / Private Company' },
  { value: 'school',     label: 'School / University' },
  { value: 'other',      label: 'Other' },
];

export default function PartnerForm() {
  const [form, setForm] = useState({
    contactName:      '',
    organizationName: '',
    email:            '',
    phone:            '',
    organizationType: '',
    partnershipType:  '',
    message:          '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const body = `Partnership interest: ${form.partnershipType}\n\n${form.message}`;
      await createMessage({
        fullName:          form.contactName,
        email:             form.email,
        phone:             form.phone || undefined,
        organizationType:  form.organizationType,
        organizationName:  form.organizationName,
        message:           body,
        type:              'partnership',
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-12">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h3 className="font-display font-black text-gray-900 text-2xl mb-2">Thank you, {form.contactName.split(' ')[0]}!</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            Your partnership inquiry has been received. Our team will review it and reach out to{' '}
            <span className="font-medium text-gray-700">{form.email}</span> within 2–3 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Contact Person *</label>
          <input
            type="text" required value={form.contactName} onChange={set('contactName')}
            placeholder="Full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Organisation Name *</label>
          <input
            type="text" required value={form.organizationName} onChange={set('organizationName')}
            placeholder="Organisation name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
          <input
            type="email" required value={form.email} onChange={set('email')}
            placeholder="you@organisation.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
          <input
            type="tel" value={form.phone} onChange={set('phone')}
            placeholder="+250 7XX XXX XXX"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Organisation Type *</label>
          <select
            required value={form.organizationType} onChange={set('organizationType')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          >
            <option value="">Select type…</option>
            {ORG_TYPES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Partnership Interest *</label>
          <select
            required value={form.partnershipType} onChange={set('partnershipType')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          >
            <option value="">Select interest…</option>
            {PARTNERSHIP_TYPES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tell us more *</label>
        <textarea
          required value={form.message} onChange={set('message')}
          rows={5}
          placeholder="Describe your organisation, the communities you serve, and how you envision partnering with Geuza…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          Something went wrong. Please try again or email us at info@geuza.africa.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#005523] disabled:opacity-60 transition-colors"
        >
          {status === 'loading' ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Submit Partnership Inquiry
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
