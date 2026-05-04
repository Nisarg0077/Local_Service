import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 9876-543-210', sub: 'Mon–Sat, 8 AM – 10 PM', color: 'emerald' },
  { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'support@smartlocal.in', sub: 'Response within 4 hours', color: 'indigo' },
  { icon: <MapPin className="w-5 h-5" />, label: 'Office', value: '5th Floor, Cyber Hub', sub: 'Gurugram, Haryana — 122002', color: 'orange' },
  { icon: <Clock className="w-5 h-5" />, label: 'Support Hours', value: 'Monday – Saturday', sub: '8:00 AM to 10:00 PM IST', color: 'purple' },
];

const reasons = [
  'Booking Issue', 'Payment Problem', 'Provider Complaint', 'Account Help',
  'Partnership Enquiry', 'Press & Media', 'Technical Bug', 'Other',
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.reason) errs.reason = 'Please select a reason';
    if (!form.message.trim() || form.message.length < 20) errs.message = 'Please describe your issue (min 20 characters)';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate API
    setIsLoading(false);
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you within 4 hours.');
  };

  const colorMap = { emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600', indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600', orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600', purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">We'd Love to Hear From You</h1>
          <p className="text-purple-100 text-lg max-w-lg mx-auto">
            Have a question, complaint, or just want to say hello? Our team responds within 4 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map(c => (
            <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-700 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${colorMap[c.color]}`}>
                {c.icon}
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{c.label}</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-white">{c.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Send Us a Message</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Fill in the form and we'll get back to you ASAP.</p>

            {submitted ? (
              <div className="text-center py-16 px-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                  Thank you, <strong>{form.name.split(' ')[0]}</strong>! We've received your message and will respond to <strong>{form.email}</strong> within 4 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', reason: '', message: '' }); }}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Rahul Verma"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none transition-all ${errors.name ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none transition-all ${errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      placeholder="9876543210"
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Reason <span className="text-red-500">*</span></label>
                  <select
                    value={form.reason}
                    onChange={handleChange('reason')}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none transition-all ${errors.reason ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'}`}
                  >
                    <option value="">Select a reason...</option>
                    {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Message <span className="text-red-500">*</span></label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Describe your issue or question in detail..."
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none resize-none transition-all ${errors.message ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'}`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                    <span className="text-xs text-slate-400">{form.message.length} chars</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Side Info */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="rounded-3xl overflow-hidden shadow-lg h-64 bg-slate-100 dark:bg-slate-800 relative">
              <img
                src="https://maps.googleapis.com/maps/api/staticmap?center=Cyber+Hub,Gurugram&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7CCyber+Hub,Gurugram&key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
                alt="Office Location Map"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-800 hidden items-center justify-center flex-col gap-2">
                <MapPin className="w-12 h-12 text-indigo-400" />
                <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">Cyber Hub, Gurugram, Haryana</p>
                <a
                  href="https://maps.google.com/?q=Cyber+Hub+Gurugram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Quick Answers</h3>
              <div className="space-y-3">
                {[
                  { q: 'How do I cancel a booking?', a: 'Go to My Bookings → Select booking → Cancel (free up to 2hr before).' },
                  { q: 'When will I get a refund?', a: 'Approved refunds are credited within 5–7 business days.' },
                  { q: 'How do I raise a complaint?', a: 'Use this form with reason "Provider Complaint" or call us directly.' },
                ].map((item, i) => (
                  <div key={i} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-3 last:pb-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.q}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
              <a href="/help" className="inline-block mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                View full Help Center →
              </a>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">We're also on social media</p>
              <div className="flex gap-3">
                {[
                  { label: 'Twitter / X', handle: '@smartlocal_in', emoji: '🐦' },
                  { label: 'Instagram', handle: '@smartlocal.india', emoji: '📸' },
                  { label: 'LinkedIn', handle: 'SmartLocal India', emoji: '💼' },
                ].map(s => (
                  <div key={s.label} className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-xl mb-1">{s.emoji}</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.label}</div>
                    <div className="text-xs text-slate-400">{s.handle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
