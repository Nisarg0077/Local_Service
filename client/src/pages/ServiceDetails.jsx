import React, { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Star, MapPin, Clock, BadgeCheck, Heart, Share2,
  ChevronRight, CheckCircle, Phone, ArrowLeft,
} from 'lucide-react';
// import { mockServices, mockProviders, mockReviews } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatCurrency, formatDate, getInitials } from '../utils';
import toast from 'react-hot-toast';
import { reviewsAPI, usersAPI } from "../services/api";
import { useEffect } from "react";

export default function ServiceDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const service = location.state?.service;
  const provider = location.state?.provider;
  const isRestricted = !user || user?.role === "provider" || user?.role === "admin";
  // const isFavorited = (user?.favorites || []).map(Number).includes(Number(service?.id));
  const isFavorited = user?.favorites
  ? user.favorites.map(Number).includes(Number(service?.id))
  : false;
  // const [userName, setUserName] = useState({});
  // const [userAvatars, setUserAvatars] = useState({});

  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const uniqueUserIds = [...new Set(reviews.map(r => r.userId))];

    //     const map = {};

    //     await Promise.all(
    //       uniqueUserIds.map(async (id) => {
    //         try {
    //           const res = await usersAPI.getUser(id);
    //           map[id] = {
    //             name: res.data.name,
    //             avatar: res.data.avatar?.startsWith('http') ? res.data.avatar : (res.data.avatar ? `http://localhost:3000${res.data.avatar}` : "/default-avatar.png"),
    //           };
    //         } catch {
    //           map[id] = {
    //             name: "Unknown User",
    //             avatar: "/default-avatar.png",
    //           };
    //         }
    //       })
    //     );

    //     setUsersMap(map);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

   const fetchUsers = async () => {
  try {
    const uniqueUserIds = [...new Set(reviews.map(r => r.userId))];

    const map = {};

    await Promise.all(
      uniqueUserIds.map(async (id) => {

        // ✅ Skip invalid IDs (VERY IMPORTANT)
        if (!id || typeof id !== "string") {
          map[id] = {
            name: "Anonymous",
            avatar: "/default-avatar.png",
          };
          return;
        }

        try {
          const res = await usersAPI.getUser(id);

          map[id] = {
            name: res.data.name || "Anonymous",
            avatar: res.data.avatar
              ? res.data.avatar.startsWith("http")
                ? res.data.avatar
                : `http://localhost:3000${res.data.avatar}`
              : "/default-avatar.png",
          };

        } catch (err) {

          // ✅ Ignore 404 silently
          if (err.response?.status !== 404) {
            console.error("User fetch error:", err);
          }

          map[id] = {
            name: "Anonymous",
            avatar: "/default-avatar.png",
          };
        }
      })
    );

    setUsersMap(map);

  } catch (err) {
    console.error(err);
  }
};

     if (!reviews.length) return;

  fetchUsers();
  }, [reviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!service?.id) return;

        const res = await reviewsAPI.getByService(service.id);
        setReviews(res.data);

      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [service]);

  const [activeTab, setActiveTab] = useState('overview');

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 dark:bg-slate-900">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Service Not Found</h2>
        <Link to="/services"><Button>Browse Services</Button></Link>
      </div>
    );
  }

  // const handleFavorite = async () => {
  //   if (!isAuthenticated) { navigate('/login'); return; }

  //   // // DEBUG LOGS
  //   // console.log("ServiceDetails: user object:", user);
  //   // console.log("ServiceDetails: user.uid:", user?.uid);

  //   const favs = user.favorites || [];
  //   const updated = isFavorited ? favs.map(Number).filter(fid => fid !== Number(service.id)) : [...favs.map(Number), Number(service.id)];

  //   // console.log("ServiceDetails: updated favorites:", updated);

  //   try {
  //     const res = await usersAPI.updateFav(user?.uid, updated);
  //     updateUser({ favorites: res.data.user.favorites });
  //     toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites! ❤️');
  //   } catch (error) {
  //     console.error("ServiceDetails: error updating favorites:", error);
  //     toast.error('Failed to update favorites');
  //   }
  // };


  const handleFavorite = async () => {
  if (!isAuthenticated || !user) {
    toast.error('Please login first');
    navigate('/login');
    return;
  }
}

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      navigate('/login', { state: { from: location } });
      return;
    }
    navigate('/booking', { state: { service, provider } });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 pb-20">

      {/* Breadcrumb / Back Navigation */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 mr-1 text-slate-500 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
          <Link to="/" className="hover:text-primary hidden sm:inline transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 hidden sm:inline" />
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 dark:text-slate-200 font-medium truncate max-w-[200px]">{service.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 bg-slate-100 dark:bg-slate-800">
              {service.image ? (
                <img src={service.image.startsWith('http') ? service.image : `http://localhost:3000${service.image}`} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🏠</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge status="Active" label={service.category} />
              </div>
              {service.popular && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">⚡ Popular</span>
                </div>
              )}
            </div>

            {/* Title + Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800 dark:text-white leading-tight">
                  {service.title}
                </h1>
                <div className="flex gap-2 shrink-0">
                  <button onClick={handleFavorite} className={`p-2 rounded-xl border-2 transition-all ${isFavorited ? 'border-danger bg-danger/10 text-danger' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-danger hover:border-danger'}`}>
                    <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={handleShare} className="p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating and meta */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm">{service.rating}</span>
                  <span className="text-slate-500 text-sm">({service.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" /> {service.duration}
                </div>
                {provider?.area && (
                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="w-4 h-4" /> {provider.area}
                  </div>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{service.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="flex border-b border-slate-100 dark:border-slate-700">
                {['overview', 'includes', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {tab} {tab === 'reviews' && `(${reviews.length})`}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-white">Service Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">Duration</p>
                        <p className="font-bold text-slate-800 dark:text-white">{service.duration}</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">Price Type</p>
                        <p className="font-bold text-slate-800 dark:text-white capitalize">{service.priceType}</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">Category</p>
                        <p className="font-bold text-slate-800 dark:text-white">{service.category}</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">Satisfaction</p>
                        <p className="font-bold text-success">98% Positive</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'includes' && (
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">What's Included</h3>
                    <ul className="space-y-3">
                      {(service.includes || []).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-5 h-5 text-success shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">No reviews yet. Be the first!</div>
                    ) : (
                      reviews.map(r => (
                        <div key={r.id || r._id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <img src={usersMap[r.userId]?.avatar?.startsWith('http') ? usersMap[r.userId].avatar : (usersMap[r.userId]?.avatar ? `http://localhost:3000${usersMap[r.userId].avatar}` : "/default-avatar.png")} alt={usersMap[r.userId]?.name || "Anonymous"} className="w-10 h-10 rounded-full shrink-0 object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-slate-800 dark:text-white">{usersMap[r.userId]?.name || "Anonymous"}</span>
                              <span className="text-xs text-slate-400">{formatDate(r.date)}</span>
                            </div>
                            <div className="flex mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking Card + Provider */}
          <div className="sticky top-20 space-y-5">

            {/* Booking Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-card">
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  {service.priceType === 'starting' && <span className="text-xs text-slate-400">Starts at</span>}
                  <span className="text-3xl font-heading font-bold text-slate-800 dark:text-white">{formatCurrency(service.price)}</span>
                </div>
                <p className="text-xs text-slate-500">Inclusive of all charges</p>
              </div>

              {/* {

                isRestricted ? (
                  <Link to="/services" className="block w-full">
                    <Button variant="outline" fullWidth size="lg" className="mb-3">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Services
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button onClick={handleBook} fullWidth size="lg" className="mb-3">
                      Book Now
                    </Button>
                    <Link to="/services" className="block w-full">
                      <Button variant="outline" fullWidth size="lg" className="mb-3">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Services
                      </Button>
                    </Link>
                  </>
                )} */}

                {!user ? (
  <Button onClick={() => navigate('/login')} fullWidth size="lg" className="mb-3">
    Login to Continue
  </Button>
) : isRestricted ? (
  <Link to="/services" className="block w-full">
    <Button variant="outline" fullWidth size="lg" className="mb-3">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Services
    </Button>
  </Link>
) : (
  <>
    <Button onClick={handleBook} fullWidth size="lg" className="mb-3">
      Book Now
    </Button>
    <Link to="/services" className="block w-full">
      <Button variant="outline" fullWidth size="lg" className="mb-3">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Button>
    </Link>
  </>
)}
              {/* <Link to="/services" className="block w-full">
                <Button variant="outline" fullWidth size="lg" className="mb-3">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Services
                </Button>
              </Link> */}
              <p className="text-xs text-center text-slate-500 mb-4">No advance payment required</p>

              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-success" /> Verified Professional
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-success" /> Satisfaction Guaranteed
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4 text-success" /> Free Cancellation (2h before)
                </div>
              </div>
            </div>

            {/* Provider Card */}
            {provider && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-card">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4 uppercase tracking-wider">
                  Your Professional
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={provider.avatar.startsWith('http') ? provider.avatar : `http://localhost:3000${provider.avatar}`}
                      alt={provider.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/20"
                    />
                    {provider.isAvailable && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-white dark:border-slate-800 rounded-full" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-slate-800 dark:text-white">{provider.name}</p>
                      {provider.verifiedBadge && <BadgeCheck className="w-4 h-4 text-primary" />}
                    </div>

                    <p className="text-xs text-slate-500">{provider.business}</p>
                    <Badge status={provider.isAvailable ? 'Active' : 'Inactive'} className="mt-1" />
                  </div>
                </div>

                {/* <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-lg font-bold text-primary">{provider.rating}</p>
                    <p className="text-[10px] text-slate-500">Rating</p>
                  </div>

                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {provider.experience}+
                    </p>
                    <p className="text-[10px] text-slate-500">Years</p>
                  </div>

                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-lg font-bold text-success">{provider.completedJobs}+</p>
                    <p className="text-[10px] text-slate-500">Jobs</p>
                  </div>
                </div> */}

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {provider.bio}
                </p>

                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5" /> {provider.area}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
