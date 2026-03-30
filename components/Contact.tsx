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
          {/* Map */}
          <div className="relative h-[300px] md:h-full min-h-[400px] rounded-xl overflow-hidden bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3419.5094097988444!2d30.057543496865957!3d-1.9493444889226081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5001ca34f6b%3A0xda51adc484809f11!2sGEUZA%20Ltd!5e0!3m2!1sen!2srw!4v1774699329564!5m2!1sen!2srw"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Geuza Location Map"
            />
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
