import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, Heart, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';

const stats = [
  { label: 'Happy Customers', value: '15,000+', icon: '😊' },
  { label: 'Verified Professionals', value: '1,000+', icon: '🔧' },
  { label: 'Cities Covered', value: '50+', icon: '🏙️' },
  { label: 'Services Completed', value: '54,000+', icon: '✅' },
];

const team = [
  { name: 'Priya Sharma', role: 'CEO & Co-Founder', avatar: 'https://i.pravatar.cc/150?img=47', bio: 'Ex-Googler with 12 years in tech. Passionate about connecting people with quality services.' },
  { name: 'Arjun Mehta', role: 'CTO & Co-Founder', avatar: 'https://i.pravatar.cc/150?img=68', bio: 'Full-stack engineer who previously built platforms for 10M+ users at Flipkart.' },
  { name: 'Neha Gupta', role: 'Head of Operations', avatar: 'https://i.pravatar.cc/150?img=49', bio: 'Operations expert ensuring every service booking goes perfectly for customers and providers.' },
  { name: 'Rohan Kapoor', role: 'Head of Design', avatar: 'https://i.pravatar.cc/150?img=53', bio: 'Award-winning designer crafting beautiful and intuitive user experiences.' },
];

const values = [
  { icon: <Award className="w-6 h-6" />, title: 'Quality First', desc: 'Every professional is background-verified, skill-tested, and regularly reviewed by real customers.' },
  { icon: <Heart className="w-6 h-6" />, title: 'Customer Love', desc: 'We obsess over delighting our customers. Your satisfaction is our mission, not just a metric.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Community Impact', desc: 'We empower local service professionals to grow their business and achieve financial independence.' },
  { icon: <Target className="w-6 h-6" />, title: 'Transparency', desc: 'No hidden charges, no surprises. Upfront pricing and real-time tracking on every booking.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-yellow-300" /> Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Redefining Home Services <br />
            <span className="text-yellow-300">Across India</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            SmartLocal was born from a simple belief: every home deserves reliable, affordable, and professional services — and every skilled professional deserves a platform to thrive.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 bg-white dark:bg-slate-700 rounded-2xl shadow-sm">
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Founded in 2022 in New Delhi, SmartLocal started with a small team of 5 and a big dream — to transform how India accesses home services. Today, we're a marketplace trusted by thousands of families and hundreds of professionals across 50+ cities.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              We believe technology can bridge the gap between quality professionals and customers who deserve the best. Every booking on SmartLocal is backed by our satisfaction guarantee.
            </p>
            <ul className="space-y-3">
              {['Vetted & background-checked professionals', 'Real-time booking & tracking', 'Transparent pricing, zero hidden fees', '24/7 customer support'].map(item => (
                <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80"
              alt="SmartLocal team"
              className="rounded-3xl shadow-2xl w-full object-cover h-80"
            />
            <div className="absolute -bottom-6 -left-6 bg-indigo-600 text-white p-5 rounded-2xl shadow-xl">
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm text-indigo-200">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-4">Our Values</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12">The principles that guide everything we do.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-4">Meet the Team</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12">The passionate people building SmartLocal.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-md" />
                <h3 className="font-bold text-slate-800 dark:text-white">{m.name}</h3>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">{m.role}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to experience SmartLocal?</h2>
        <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Join thousands of happy customers. Book a service in under 60 seconds.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/services" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Browse Services <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/register" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Join as Provider
          </Link>
        </div>
      </section>
    </div>
  );
}
