import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Tag, ArrowRight, Search, Zap } from 'lucide-react';

const posts = [
  {
    id: 1, slug: 'how-to-choose-electrician', category: 'Tips & Guides',
    title: 'How to Choose the Right Electrician for Your Home',
    excerpt: 'Wiring issues can be dangerous. Here\'s everything you need to know before hiring an electrician — licenses, questions to ask, red flags to watch.',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80',
    author: 'Priya Sharma', authorAvatar: 'https://i.pravatar.cc/150?img=47',
    date: 'Apr 8, 2026', readTime: '5 min read', featured: true,
  },
  {
    id: 2, slug: 'ac-service-summer-guide', category: 'Seasonal',
    title: 'Your Complete Summer AC Service Checklist',
    excerpt: 'Beat the heat! Get your AC serviced before summer hits its peak. We cover everything from gas refill to coil cleaning.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80',
    author: 'Arjun Mehta', authorAvatar: 'https://i.pravatar.cc/150?img=68',
    date: 'Apr 5, 2026', readTime: '4 min read', featured: false,
  },
  {
    id: 3, slug: 'deep-cleaning-benefits', category: 'Home Care',
    title: '7 Surprising Benefits of Deep Cleaning Your Home',
    excerpt: 'Beyond the obvious cleanliness, deep cleaning has proven benefits for your health, productivity, and even sleep quality.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    author: 'Neha Gupta', authorAvatar: 'https://i.pravatar.cc/150?img=49',
    date: 'Mar 28, 2026', readTime: '6 min read', featured: false,
  },
  {
    id: 4, slug: 'smartlocal-expansion-2026', category: 'Company News',
    title: 'SmartLocal Expands to 20 New Cities in 2026',
    excerpt: 'We\'re thrilled to announce our expansion into 20 new cities across India, bringing trusted professionals closer to you.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
    author: 'Priya Sharma', authorAvatar: 'https://i.pravatar.cc/150?img=47',
    date: 'Mar 20, 2026', readTime: '3 min read', featured: false,
  },
  {
    id: 5, slug: 'monsoon-home-prep', category: 'Seasonal',
    title: 'Monsoon-Proof Your Home: The Ultimate Checklist',
    excerpt: 'Waterproofing, drainage checks, termite prevention — everything you need before the rains arrive.',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80',
    author: 'Rohan Kapoor', authorAvatar: 'https://i.pravatar.cc/150?img=53',
    date: 'Mar 14, 2026', readTime: '7 min read', featured: false,
  },
  {
    id: 6, slug: 'provider-success-story', category: 'Stories',
    title: 'From Struggling to Thriving: Aryan\'s SmartLocal Success Story',
    excerpt: 'Aryan Sharma went from irregular gigs to ₹90,000/month on SmartLocal. Here\'s his inspiring journey.',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80',
    author: 'Neha Gupta', authorAvatar: 'https://i.pravatar.cc/150?img=49',
    date: 'Mar 5, 2026', readTime: '8 min read', featured: false,
  },
];

const categories = ['All', 'Tips & Guides', 'Seasonal', 'Home Care', 'Company News', 'Stories'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const featured = posts.find(p => p.featured);
  const filtered = posts.filter(p =>
    !p.featured &&
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-pink-600 to-rose-600 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 text-yellow-300" /> SmartLocal Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tips, Stories & Insights</h1>
          <p className="text-orange-100 text-lg mb-8">Home care guides, success stories, and the latest from SmartLocal.</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-slate-800 outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Featured Post */}
        {featured && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              🌟 Featured Article
            </h2>
            <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src={featured.image} alt={featured.title} className="w-full h-64 md:h-full object-cover" />
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">{featured.category}</span>
                  <span className="text-slate-400 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 leading-tight">{featured.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={featured.authorAvatar} alt={featured.author} className="w-8 h-8 rounded-full" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{featured.author} · {featured.date}</span>
                  </div>
                  <button className="flex items-center gap-1 text-orange-600 font-bold text-sm hover:underline">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === c ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-600'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-slate-500">No articles found.</div>
          ) : (
            filtered.map(post => (
              <article key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700 group">
                <div className="overflow-hidden h-48">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{post.category}</span>
                    <span className="text-slate-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-orange-600 transition-colors">{post.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <img src={post.authorAvatar} alt={post.author} className="w-6 h-6 rounded-full" />
                      <span className="text-xs text-slate-500">{post.author} · {post.date}</span>
                    </div>
                    <button className="text-orange-500 hover:text-orange-600 font-semibold text-xs flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Newsletter */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-pink-600 rounded-3xl p-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
          <p className="text-orange-100 mb-6">Get our latest articles and home care tips delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="you@example.com" className="flex-1 px-4 py-3 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-white/50" />
            <button className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
