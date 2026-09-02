import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  ChevronDown,
  Grid3X3,
  List,
} from "lucide-react";
import ServiceCard from "../components/service/ServiceCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
// import { mockServices, mockProviders, categories } from '../data/mockData';
import { SORT_OPTIONS, PRICE_RANGES } from "../constants";
import { useDebounce } from "../hooks/useDebounce";
import { servicesAPI, providerAPI } from "../services/api";
import axios from "axios";

const DELAY_MS = 600;

export default function ServicesList() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [searchInput, setSearchInput] = useState(params.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(
    params.get("category") || "All",
  );
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [provider, setProvider] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await providerAPI.getAll();
        // console.log("ProviderData: ",res.data);
        setProvider(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProviders();
  }, []);

  // const provider = providerData.find(
  //   (p) => String(p.id) === String(displayedServices.providerId)
  // );

  // console.log("ProviderData: ", provider)
  // console.log("Provider: ", provider)

  const applyFilters = useCallback(() => {
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const res = await servicesAPI.getAll();
        const categories = await axios.get(
          "http://localhost:3000/api/categories/",
        );
        // console.log(categories.data)
        setCategories(categories.data);

        let services = res.data; // database services

        // console.log("services: ",services.map(s => s.providerId))
        // Category filter
        if (activeCategory !== "All") {
          services = services.filter((s) => s.category === activeCategory);
        }

        // Search filter
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          services = services.filter(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              s.category.toLowerCase().includes(q) ||
              (s.description || "").toLowerCase().includes(q),
          );
        }

        // Price filter
        if (priceRange) {
          services = services.filter(
            (s) => s.price >= priceRange.min && s.price <= priceRange.max,
          );
        }

        // Rating filter
        if (minRating > 0) {
          services = services.filter((s) => s.rating >= minRating);
        }

        // Sorting
        switch (sortBy) {
          case "price_asc":
            services.sort((a, b) => a.price - b.price);
            break;

          case "price_desc":
            services.sort((a, b) => b.price - a.price);
            break;

          case "reviews":
            services.sort((a, b) => b.reviewCount - a.reviewCount);
            break;

          default:
            services.sort((a, b) => b.rating - a.rating);
            break;
        }
        // console.log(services)
        setDisplayedServices(services);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch services", error);
      }

      setIsLoading(false);
    }, DELAY_MS);
  }, [activeCategory, debouncedSearch, priceRange, minRating, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchInput("");
    setActiveCategory("All");
    setSortBy("rating");
    setPriceRange(null);
    setMinRating(0);
    setCurrentPage(1);
  };

  const activeFilterCount = [
    activeCategory !== "All",
    !!priceRange,
    minRating > 0,
    sortBy !== "rating",
  ].filter(Boolean).length;

  const totalPages = Math.ceil(displayedServices.length / itemsPerPage);
  const currentServices = displayedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary to-indigo-700 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-900 py-14 px-6 relative overflow-hidden">
        {/* Optional background decorations */}
        <div className="absolute inset-0 hero-pattern opacity-10 dark:opacity-30" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 text-center">
            Find Your Service
          </h1>
          <p className="text-white/70 text-center mb-8">
            {displayedServices.length}+ professionals ready to help you today
          </p>
          {/* Search */}
          <div className="flex gap-2 transition-all bg-white/30 focus-within:bg-white/40 dark:bg-slate-800/40 dark:focus-within:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl p-2 shadow-xl max-w-xl focus-within:max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search services, e.g. AC Repair..."
                className="flex-1 bg-transparent outline-none text-black dark:text-white placeholder:text-slate-500  font-bold text-sm"
                aria-label="Search services"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Controls Bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters((o) => !o)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${showFilters ? "border-primary bg-red-500 text-white" : "bg-blue-900 border-slate-200 dark:border-slate-700 text-white dark:text-slate-300 hover:border-primary"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${showFilters ? "bg-white text-primary" : "bg-primary text-white"}`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-semibold border-2 border-slate-200 dark:border-slate-700/50 bg-white backdrop-blur-sm dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 focus:border-primary outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} >
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Results count */}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {displayedServices.length} found
            </span>
            {/* View toggle */}
            <div className="flex border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-2xl border border-white/50 dark:border-slate-700/50 p-6 mb-6 animate-slide-up shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Price Range
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPriceRange(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!priceRange ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                  >
                    All Prices
                  </button>
                  {PRICE_RANGES.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => setPriceRange(r)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${priceRange?.label === r.label ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Minimum Rating
                </p>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${minRating === r ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                    >
                      {r === 0 ? (
                        "Any Rating"
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{" "}
                          {r}+ Stars
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-danger border border-danger/30 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition-colors"
                >
                  <X className="w-4 h-4" /> Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("All")}
            className={`whitespace-nowrap px-4 py-2 mt-2 ml-1 rounded-full text-sm font-semibold transition-all hover:scale-105 shrink-0 ${activeCategory === "All" ? "bg-slate-800/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-800 shadow-md" : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:border-primary"}`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap px-4 py-2 ml-1 mt-2 rounded-full text-sm font-semibold transition-all hover:scale-110 shrink-0 ${activeCategory === cat.name ? "bg-slate-800/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-800 shadow-md" : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:border-primary/60"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : currentServices.length > 0 ? (
          <>
            <div
              className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "w-full flex justify-center"}`}
            >
              {currentServices.map((service) => {
                const serviceProvider = provider.find(
                  (p) =>
                    String(p.id) === String(service.providerId) ||
                    String(p.providerId) === String(service.providerId),
                );
                // console.log(serviceProvider);

                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    provider={serviceProvider}
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none scrollbar-hide">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 shrink-0 rounded-xl text-sm font-semibold transition-all ${currentPage === i + 1
                        ? "bg-primary text-white shadow-md"
                        : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-heading font-bold text-slate-700 dark:text-white mb-2">
              No Services Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Try adjusting your search or filters.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
