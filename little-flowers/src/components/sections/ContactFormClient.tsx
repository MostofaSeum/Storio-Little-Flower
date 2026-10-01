'use client';

import React, { useState } from 'react';
import ThemeIcon from '@/components/ui/ThemeIcon';
import { StorioSettingsResponse } from '@storio/template-sdk';

interface ContactFormClientProps {
  settings?: StorioSettingsResponse | null;
  tenantHost: string;
}

export default function ContactFormClient({ settings, tenantHost }: ContactFormClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-host': tenantHost,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const err = data?.error || data?.message || data?.detail || `Failed to submit message (${res.status}).`;
        setErrorMessage(err);
        setStatus('error');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <div className="site-container px-4 sm:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-50 text-primary-color border border-purple-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900 leading-tight">
              We’d Love to Hear From You!
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-quicksand leading-relaxed">
              Have questions about admissions, curriculum, tuition fees, or campus tours?
              Our friendly admissions and parent support staff are here to assist you.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Address */}
            {settings?.mailing_address && (
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-pastel-purple/50 border border-purple-100">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                  <ThemeIcon name="location-pin" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-fredoka text-gray-900">Campus Location</h3>
                  <p className="text-xs text-gray-600 font-quicksand mt-0.5 leading-relaxed">
                    {settings.mailing_address}
                  </p>
                </div>
              </div>
            )}

            {/* Phone */}
            {settings?.phone_number && (
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-pastel-purple/50 border border-purple-100">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                  <ThemeIcon name="phone-call" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-fredoka text-gray-900">Phone</h3>
                  <p className="text-xs text-gray-600 font-quicksand mt-0.5">
                    <a
                      href={`tel:${settings.phone_number}`}
                      className="hover:text-primary-color transition-colors font-medium"
                    >
                      {settings.phone_number}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Email */}
            {settings?.contact_email && (
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-pastel-purple/50 border border-purple-100">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                  <ThemeIcon name="mail-envelope" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-fredoka text-gray-900">Email</h3>
                  <p className="text-xs text-gray-600 font-quicksand mt-0.5">
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="hover:text-primary-color transition-colors font-medium"
                    >
                      {settings.contact_email}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Submission Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-xl relative overflow-hidden">
          {status === 'success' ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-inner">
                <ThemeIcon name="success-check" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-fredoka text-gray-900">
                Message Sent Successfully!
              </h3>
              <p className="text-sm text-gray-600 font-quicksand max-w-md mx-auto leading-relaxed">
                Thank you for contacting {settings?.site_title || 'our school'}. Our administration team has received your message and will get back to you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-color text-white hover:bg-opacity-90 transition-all cursor-pointer shadow-md"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-purple-50 pb-4 mb-2">
                <h3 className="text-xl font-bold font-fredoka text-gray-900">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-gray-500 font-quicksand mt-0.5">
                  Fill out the form below and we will route your inquiry to the right department.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Your Full Name <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 rounded-2xl bg-purple-50/50 border border-purple-100 focus:outline-none focus:border-primary-color text-sm text-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-purple-50/50 border border-purple-100 focus:outline-none focus:border-primary-color text-sm text-gray-900 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-2xl bg-purple-50/50 border border-purple-100 focus:outline-none focus:border-primary-color text-sm text-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject of your message"
                    className="w-full px-4 py-3 rounded-2xl bg-purple-50/50 border border-purple-100 focus:outline-none focus:border-primary-color text-sm text-gray-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Your Message <span className="text-accent-pink">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={`How can we help your child flourish with us?`}
                  className="w-full px-4 py-3 rounded-2xl bg-purple-50/50 border border-purple-100 focus:outline-none focus:border-primary-color text-sm text-gray-900 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 px-6 rounded-2xl bg-primary-color text-white font-bold text-sm hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
