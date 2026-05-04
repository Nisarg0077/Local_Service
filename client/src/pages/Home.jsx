import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Shield,
  Clock,
  ChevronRight,
  ArrowRight,
  Zap,
  CheckCircle,
} from "lucide-react";
import ServiceCard from "../components/service/ServiceCard";
import {
  mockServices,
  mockProviders,
  stats,
  testimonials,
} from "../data/mockData";
import { SERVICE_CATEGORIES } from "../constants";
import { formatCurrency } from "../utils";
import { servicesAPI, providerAPI } from "../services/api";

const statItems = [
  {
    label: "Happy Customers",
    value: stats.users,
    suffix: "+",
    color: "text-primary",
  },
  {
    label: "Expert Providers",
    value: stats.providers,
    suffix: "+",
    color: "text-secondary",
  },
  {
    label: "Services Completed",
    value: stats.bookings,
    suffix: "+",
    color: "text-success",
  },
  { label: "Cities Covered", value: 42, suffix: "+", color: "text-accent" },
];

function AnimatedCounter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <>
      {count.toLocaleString("en-IN")}
      {suffix}
    </>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [popularServices, setPopulerServices] = useState([]);
  const [provider, setProvider] = useState([]);
  // console.log(popularServices.map(d => d.populer))

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesAPI.getAll();
        // console.log("ServicesData: ",res.data);
        setPopulerServices(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProviders = async () => {
      try {
        const res = await providerAPI.getAll();
        // console.log("ProviderData: ",res.data);
        setProvider(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
    fetchProviders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-primary to-indigo-700 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-900 py-24 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 hero-pattern opacity-30" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-accent" />
            India's #1 Home Services Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-5">
            Find Trusted Local
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              Professionals Near You
            </span>
          </h1>
          <p className="text-lg text-white/75 mb-10 max-w-2xl mx-auto">
            Book verified home service experts in minutes. Electricians,
            plumbers, cleaners, and more — all at transparent prices.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="flex-1 text-slate-800 dark:text-white placeholder:text-slate-400 bg-transparent outline-none text-sm"
                aria-label="Search services"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-glow active:scale-95 flex items-center gap-2"
            >
              Search <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" /> Verified
              Professionals
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-secondary" /> Safe & Secure
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" /> On-Time Guarantee
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE CATEGORIES ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white mb-3">
            What Are You Looking For?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From quick fixes to full home renovations — we have experts for
            every need.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/services?category=${cat.label}`}
              className="group flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── POPULAR SERVICES ── */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white mb-2">
                Popular Services
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Most booked this week by customers near you
              </p>
            </div>
            <Link
              to="/services"
              className="hidden md:flex items-center gap-1 text-primary font-semibold hover:underline text-sm"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices
              .filter((service) => service.popular === true)
              .slice(0, 4)
              .map((service) => {
                const serviceProvider = provider.find(
                  (p) =>
                    String(p.id) === String(service.providerId) ||
                    String(p.providerId) === String(service.providerId),
                );

                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    provider={serviceProvider}
                  />
                );
              })}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold"
            >
              View All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white mb-3">
            How It Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Get your service done in 3 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-0.5 bg-gradient-to-r from-primary/40 to-secondary/40" />

          {[
            {
              step: "01",
              icon: "🔍",
              title: "Search & Choose",
              desc: "Browse our verified professionals by category, ratings, and location.",
            },
            {
              step: "02",
              icon: "📅",
              title: "Book Instantly",
              desc: "Pick your preferred time slot and complete secure payment in seconds.",
            },
            {
              step: "03",
              icon: "✅",
              title: "Enjoy the Service",
              desc: "Our expert arrives on time and delivers guaranteed quality work.",
            },
          ].map((step, i) => (
            <div
              key={step.step}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="relative inline-flex w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center text-4xl shadow-card">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white mb-3">
              What Our Customers Say
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Trusted by over {stats.users.toLocaleString("en-IN")}+ customers
              nationwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-800 p-7 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 hover:shadow-card-hover transition-shadow group"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic text-sm leading-relaxed mb-6">
                  "{t.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/20 object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.service} · {t.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-indigo-700 dark:from-indigo-900 dark:to-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Book Your First Service?
          </h2>
          <p className="text-white/70 mb-8">
            Join over {stats.users.toLocaleString("en-IN")}+ satisfied
            customers. New users get ₹100 off on first booking!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="px-8 py-3.5 bg-white text-primary font-bold rounded-2xl hover:bg-slate-100 transition-colors hover:shadow-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
