import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Search, Filter, Zap } from 'lucide-react';

const departments = ['All', 'Engineering', 'Design', 'Operations', 'Marketing', 'Sales', 'Customer Success'];

const jobs = [
  { id: 1, title: 'Senior React Developer', dept: 'Engineering', location: 'Bengaluru / Remote', type: 'Full-time', experience: '3-5 years', posted: '2 days ago', hot: true },
  { id: 2, title: 'Node.js Backend Engineer', dept: 'Engineering', location: 'New Delhi', type: 'Full-time', experience: '2-4 years', posted: '1 week ago', hot: true },
  { id: 3, title: 'Product Designer (UI/UX)', dept: 'Design', location: 'Remote', type: 'Full-time', experience: '2-5 years', posted: '3 days ago', hot: false },
  { id: 4, title: 'City Operations Manager', dept: 'Operations', location: 'Mumbai', type: 'Full-time', experience: '4-6 years', posted: '5 days ago', hot: false },
  { id: 5, title: 'Growth Marketing Specialist', dept: 'Marketing', location: 'Bengaluru', type: 'Full-time', experience: '1-3 years', posted: '1 week ago', hot: false },
  { id: 6, title: 'Business Development Executive', dept: 'Sales', location: 'Delhi / Mumbai', type: 'Full-time', experience: '1-2 years', posted: '3 days ago', hot: false },
  { id: 7, title: 'Customer Success Manager', dept: 'Customer Success', location: 'Remote', type: 'Full-time', experience: '2-4 years', posted: '4 days ago', hot: false },
  { id: 8, title: 'DevOps Engineer', dept: 'Engineering', location: 'Bengaluru', type: 'Full-time', experience: '3-5 years', posted: '6 days ago', hot: false },
  { id: 9, title: 'Content Writer (Tech & Lifestyle)', dept: 'Marketing', location: 'Remote', type: 'Part-time', experience: '1-2 years', posted: '2 weeks ago', hot: false },
];

const perks = [
  { icon: '🏠', title: 'Remote Friendly', desc: 'Flexible work-from-home or hybrid options for most roles.' },
  { icon: '💰', title: 'Competitive Pay', desc: 'Market-leading salaries + equity for early team members.' },
  { icon: '📚', title: 'Learning Budget', desc: '₹50,000/yr for courses, conferences, and certifications.' },
  { icon: '🏥', title: 'Health Insurance', desc: 'Full medical, dental, and vision coverage for you and your family.' },
  { icon: '🌴', title: 'Unlimited Leaves', desc: 'Take time when you need it. We trust you.' },
  { icon: '🎉', title: 'Team Events', desc: 'Quarterly offsites, team lunches, and hackathons.' },
];

export default function Careers() {
  const [activeDept, setActiveDept] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = jobs.filter(j =>
    (activeDept === 'All' || j.dept === activeDept) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) || j.dept.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4 text-yellow-300" /> We're Hiring!
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Build the Future of <br />
            <span className="text-yellow-300">Home Services</span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-xl mx-auto mb-8">
            Join a passionate team solving real problems for millions of households across India. We move fast, think big, and care deeply.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 font-bold px-6 py-3 rounded-xl">
            <span>🚀</span> {jobs.length} Open Positions
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-10">Why SmartLocal?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {perks.map(p => (
              <div key={p.title} className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">{p.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">Open Positions</h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {departments.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDept(d)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeDept === d ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-600'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-500">No open positions match your search.</div>
            ) : (
              filtered.map(job => (
                <div key={job.id} className="group border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-emerald-400 hover:shadow-md transition-all bg-white dark:bg-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{job.title}</h3>
                        {job.hot && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">🔥 Hot</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.dept}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                        <span>• {job.experience}</span>
                        <span>• Posted {job.posted}</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Don't see a role for you?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">We're always looking for talented people. Send us your resume!</p>
            <a href="mailto:careers@smartlocal.in" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
              📧 careers@smartlocal.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
