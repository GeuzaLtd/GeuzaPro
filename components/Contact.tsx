'use client';

import React, { useState } from 'react';
import { SectionHeader, Button } from './ui';
import { createMessage } from '@/actions/messages';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    organizationType: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      await createMessage({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        organizationType: formData.organizationType,
        message: formData.message,
      });
      setSent(true);
      setFormData({ fullName: '', phoneNumber: '', email: '', organizationType: '', message: '' });
    } catch {
      setSendError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <SectionHeader title="Contact us" />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Map + contact info */}
          <div className="flex flex-col gap-5">
            <div className="relative h-[280px] md:h-[320px] rounded-xl overflow-hidden bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d422.4181041911447!2d30.102106997130342!3d-1.9640917921145975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e9!4m3!3m2!1d-2.0016192!2d30.0897769!4m3!3m2!1d-1.963871!2d30.102280999999998!5e0!3m2!1sen!2srw!4v1777973313517!5m2!1sen!2srw"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Geuza Location Map"
              />
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <a href="mailto:info@geuza.africa" className="flex items-center gap-3 hover:text-primary transition-colors">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                info@geuza.africa
              </a>
              <a href="tel:+250796084144" className="flex items-center gap-3 hover:text-primary transition-colors">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                +250 796 084 144
              </a>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                Kigali, Rwanda, Remera-Gasabo
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
                Mon – Fri, 9:00 AM – 5:00 PM
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Get in Touch With us
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  aria-label="Organization Type"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-500"
                  required
                >
                  <option value="">Organization Type</option>
                  <option value="ngo">NGO</option>
                  <option value="government">Government</option>
                  <option value="private">Private Company</option>
                  <option value="individual">Individual</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
              {sent && (
                <p className="text-primary text-sm font-medium">Message sent! We&apos;ll get back to you soon.</p>
              )}
              {sendError && (
                <p className="text-red-500 text-sm">{sendError}</p>
              )}
              <div className="flex justify-end">
                <Button type="submit" disabled={sending}>
                  {sending ? 'Sending…' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
