import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, BookOpen, MessageCircle, Phone, Mail, Zap } from 'lucide-react';

const categories = [
  {
    icon: '📦', label: 'Booking & Scheduling',
    faqs: [
      { q: 'How do I book a service?', a: 'Browse services, select one, choose a time slot, and confirm with your address. You\'ll receive an instant confirmation SMS and email.' },
      { q: 'Can I reschedule or cancel a booking?', a: 'Yes! You can reschedule or cancel up to 2 hours before the service starts for free. Cancellations after that may incur a ₹50 fee.' },
      { q: 'How far in advance can I book?', a: 'You can book up to 30 days in advance. Same-day bookings are available for select services and locations.' },
      { q: 'Can I choose a specific professional?', a: 'Yes, you can search for a specific provider and book them directly if they are available in your area.' },
    ]
  },
  {
    icon: '💳', label: 'Payments & Pricing',
    faqs: [
      { q: 'What payment methods are accepted?', a: 'We accept UPI (GPay, PhonePe, Paytm), debit/credit cards, net banking, and cash on completion.' },
      { q: 'Are there any hidden charges?', a: 'Absolutely not. The price shown at checkout is the final price you pay. No hidden charges whatsoever.' },
      { q: 'When am I charged?', a: 'Payment is due after the service is completed and you\'ve marked it as done. For advance bookings, a small deposit may be required.' },
      { q: 'How do I get an invoice?', a: 'A GST invoice is automatically emailed to you after payment. You can also download it from your booking history.' },
    ]
  },
  {
    icon: '⭐', label: 'Quality & Trust',
    faqs: [
      { q: 'How are professionals verified?', a: 'All professionals undergo a background check, ID verification, and skills assessment before they can accept bookings on SmartLocal.' },
      { q: 'What if I\'m not satisfied with the service?', a: 'We offer a 24-hour re-service guarantee. If you\'re unhappy, report it and we\'ll send another professional at no extra cost.' },
      { q: 'Are your professionals insured?', a: 'Yes, all SmartLocal professionals are covered by our service guarantee. Any accidental damage during the service is covered under our policy.' },
    ]
  },
  {
    icon: '👤', label: 'Account & Profile',
    faqs: [
      { q: 'How do I create an account?', a: 'Click "Register" on our website or app. You can sign up with email. Registration is free and takes under a minute.' },
      { q: 'How do I update my address or phone number?', a: 'Go to your dashboard → Profile Settings → and update your details. Changes are saved instantly.' },
      { q: 'Can I have multiple accounts?', a: 'Each email address can only be associated with one account. If you need both Customer and Provider access, please contact support.' },
    ]
  },
  {
    icon: '🔧', label: 'For Service Providers',
    faqs: [
      { q: 'How do I join as a service provider?', a: 'Register with the "Service Provider" role. Complete your profile, upload required documents, and our team will verify you within 24-48 hours.' },
      { q: 'How does payment work for providers?', a: 'Earnings are settled weekly to your registered bank account. You can see all pending and completed payments in your provider dashboard.' },
      { q: 'Can I set my own availability?', a: 'Yes! You have full control over your availability calendar. Set your working hours, off days, and service radius from your dashboard.' },
    ]
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between py-4 text-left gap-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <span className="font-semibold text-slate-800 dark:text-white text-sm md:text-base">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-8">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  const filtered = search
    ? categories.flatMap(c => c.faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())))
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-purple-100 mb-8">Browse our FAQ or search for answers below.</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-slate-800 outline-none shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {search && filtered ? (
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Search Results for "{search}"</h2>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-500">No results found.</div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 px-6 divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-8">
            {/* Category Nav */}
            <div className="space-y-2">
              {categories.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => setActiveCategory(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors ${activeCategory === i ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>

            {/* FAQs */}
            <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 px-6">
              <h2 className="font-bold text-slate-800 dark:text-white py-4 border-b border-slate-100 dark:border-slate-700">
                {categories[activeCategory].icon} {categories[activeCategory].label}
              </h2>
              <div>
                {categories[activeCategory].faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
              </div>
            </div>
          </div>
        )}

        {/* Contact Options */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-10">Still need help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <MessageCircle className="w-6 h-6" />, title: 'Live Chat', desc: 'Chat with our team instantly. Available 8 AM – 10 PM daily.', action: 'Start Chat', color: 'indigo' },
              { icon: <Phone className="w-6 h-6" />, title: 'Call Us', desc: 'Speak directly to a support agent at +91 9876-543-210.', action: 'Call Now', color: 'emerald' },
              { icon: <Mail className="w-6 h-6" />, title: 'Email Support', desc: 'Send us an email at support@smartlocal.in. Reply in 4 hours.', action: 'Send Email', color: 'orange' },
            ].map(opt => (
              <div key={opt.title} className="text-center p-6 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 bg-${opt.color}-100 dark:bg-${opt.color}-900/30 text-${opt.color}-600 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  {opt.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">{opt.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{opt.desc}</p>
                <Link to="/contact" className={`inline-block bg-${opt.color}-600 hover:bg-${opt.color}-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors`}>
                  {opt.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
