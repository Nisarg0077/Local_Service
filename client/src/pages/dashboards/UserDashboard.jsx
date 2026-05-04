import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, Calendar, User, Heart, CreditCard, LogOut,
  Bell, Plus, Star, ChevronRight, RefreshCw, MapPin, Clock,
  MessageSquare, X, Send, CheckCircle,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, servicesAPI, providerAPI, usersAPI } from '../../services/api';
import { formatCurrency, formatDate, getInitials } from '../../utils';
import { reviewsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import ProfileTab from '../../components/common/ProfileTab';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'reviews', label: 'My Reviews', icon: Star },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

// ── Star Rating Picker ──
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${n <= (hovered || value)
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-300 dark:text-slate-600'
              }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Leave Review Modal ──
function LeaveReviewModal({ booking, service, user, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    setLoading(true);
    try {
      await reviewsAPI.create({
        serviceId: String(booking.serviceId),
        userId: user?.uid || user?.id || user?._id,
        userName: user?.name || 'Anonymous',
        rating,
        comment: comment.trim(),
      });
      toast.success('Review submitted! It will be visible after admin approval.');
      onSubmitted();
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Rate this Service</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[260px]">{service?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Service info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
              {service?.category === 'Electrician' ? '⚡' :
                service?.category === 'Plumber' ? '🔧' :
                  service?.category === 'Cleaning' ? '🧹' :
                    service?.category === 'AC Repair' ? '❄️' :
                      service?.category === 'Carpentry' ? '🪚' :
                        service?.category === 'Painting' ? '🎨' :
                          service?.category === 'Pest Control' ? '🐛' : '🏠'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{service?.title}</p>
              <p className="text-xs text-slate-500">{formatDate(booking.date)} at {booking.time}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Your Rating <span className="text-danger">*</span>
            </label>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                {rating === 1 ? '😞 Poor' : rating === 2 ? '😕 Fair' : rating === 3 ? '😊 Good' : rating === 4 ? '😄 Very Good' : '🤩 Excellent!'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Write a Review <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience with this service..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <p className="text-xs text-slate-400 text-right mt-1">{comment.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('All');
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);

  // Review state
  const [userReviews, setUserReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState(null); // { booking, service }
  const [submittedServiceIds, setSubmittedServiceIds] = useState(new Set());

  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const userId = user?.uid;
  const filteredBookings = statusFilter === 'All' ? userBookings : userBookings.filter(b => b.status === statusFilter);
  // const favoriteServices = services.filter(s =>
  //   user?.favorites.includes(String(s.id))
  // );
  const location = useLocation();
  const state = location.state || {};

  useEffect(() => {
    if (state.activeTab === 'favorites') {
      setActiveTab('favorites');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (state.activeTab === 'profile') {
      setActiveTab('profile');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [state, navigate]);


  const favoriteServices = services.filter(s =>
    (user?.favorites || []).map(Number).includes(Number(s.id))
  );

  const stats = [
    { label: 'Total Bookings', value: userBookings.length, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending', value: userBookings.filter(b => b.status === 'Pending').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Confirmed', value: userBookings.filter(b => b.status === 'Confirmed').length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Completed', value: userBookings.filter(b => b.status === 'Completed').length, color: 'text-success', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Cancelled', value: userBookings.filter(b => b.status === 'Cancelled').length, color: 'text-danger', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  useEffect(() => {
    fetchServices();
    fetchProviders();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchFavorites();
    }
  }, [user?.uid]);

  const fetchFavorites = async () => {
    try {
      const userId = user?.uid;
      const res = await usersAPI.getFavorites(userId);

      updateUser({
        favorites: res.data.favorites || []
      });

    } catch (err) {
      console.error("Failed to load favorites", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await servicesAPI.getAll();
      setServices(res.data);
    } catch (err) {
      console.error("Failed to load services", err);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await providerAPI.getAll();
      setProviders(res.data);
    } catch (err) {
      console.error("Failed to load providers", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const res = await bookingsAPI.getByUser(userId);
      const realBookings = res.data.map(b => ({
        ...b,
        id: b._id || b.id
      }));

      setUserBookings(realBookings);
    } catch (err) {
      console.error(err);
      setUserBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };
  // Fetch user reviews when reviews tab is active
  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchUserReviews();
    }
  }, [activeTab]);

  const fetchUserReviews = async () => {
    if (!userId) return;
    setReviewsLoading(true);
    try {
      const res = await reviewsAPI.getByUser(userId);
      setUserReviews(res.data || []);
      const ids = new Set((res.data || []).map(r => String(r.serviceId)));
      setSubmittedServiceIds(ids);
    } catch (err) {
      // Silently fall back to empty — backend may not have this user's reviews yet
      setUserReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setReviewModal(null);
    fetchUserReviews();
  };

  const handleLogout = () => { logout(); navigate('/'); toast.success('Logged out successfully!'); };

  const handleRebook = (booking) => {
    const service = services.find(s => String(s.id) === String(booking.serviceId));
    const provider = providers.find(p => String(p.id) === String(booking.providerId));
    navigate('/booking', { state: { service, provider } });
  };

  const handleRemoveFavorite = async (serviceId) => {
    // DEBUG LOGS
    // console.log("UserDashboard: user object:", user);
    // console.log("UserDashboard: user.uid:", user?.uid);

    // const updated = user.favorites.filter(id => id !== serviceId);

    const updated = (user.favorites || []).filter(id => id !== Number(serviceId));

    // console.log("UserDashboard: updated favorites:", updated);

    try {
      const res = await usersAPI.updateFav(user?.uid, updated);
      updateUser({ favorites: res.data.user.favorites });
      toast.success('Removed from favorites');
    } catch (error) {
      console.error("UserDashboard: error updating favorites:", error);
      toast.error('Failed to remove favorite');
    }
  };

  const openReviewModal = (booking) => {
    const service = services.find(s => String(s.id) === String(booking.serviceId));
    setReviewModal({ booking, service });
  };

  // Completed bookings eligible for review
  const completedBookings = userBookings.filter(b => b.status === 'Completed');

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">

        {/* ── SIDEBAR ── */}
        <aside className="w-full md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
          {/* User Info */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              {user?.avatar
                ? <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:3000${user.avatar}`} alt={user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20" />
                : <div className="w-12 h-12 rounded-2xl bg-primary text-white font-bold flex items-center justify-center">{getInitials(user?.name)}</div>
              }
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white truncate">{user?.name}</h3>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-primary text-white shadow-glow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.id === 'favorites' && favoriteServices.length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                      {favoriteServices.length}
                    </span>
                  )}
                  {item.id === 'reviews' && userReviews.length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                      {userReviews.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <Link to="/services">
              <button className="flex items-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors mb-2">
                <Plus className="w-4 h-4" /> Book a Service
              </button>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 md:p-8">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening with your account.</p>
                </div>
                <Link to="/services" className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" /> New Booking
                </Link>
              </div>

              {/* Stats — 5 cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map(s => (
                  <div key={s.label} className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card`}>
                    <div className={`inline-block px-2 py-1 rounded-lg text-xs font-bold mb-3 ${s.bg} ${s.color}`}>
                      {s.label}
                    </div>
                    <div className={`text-3xl font-heading font-bold ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 dark:text-white text-sm">View Bookings</p>
                      <p className="text-xs text-slate-500">Track your requests</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-danger" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 dark:text-white text-sm">View Favorites</p>
                      <p className="text-xs text-slate-500">Quick access services</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 dark:text-white text-sm">Edit Profile</p>
                      <p className="text-xs text-slate-500">Update your details</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="font-bold text-slate-800 dark:text-white">Recent Bookings</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        {['Service', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {userBookings.slice(0, 5).map(b => {
                        const svc = services.find(s => String(s.id) === String(b.serviceId));
                        return (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{svc?.title || '—'}</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{formatDate(b.date)} at {b.time}</td>
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</td>
                            <td className="px-6 py-4"><Badge status={b.status} /></td>
                            <td className="px-6 py-4">
                              {b.status === 'Completed' && (
                                <button onClick={() => handleRebook(b)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" /> Rebook
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '⚡', label: 'Electrician', to: '/services?category=Electrician' },
                  { icon: '🔧', label: 'Plumber', to: '/services?category=Plumber' },
                  { icon: '🧹', label: 'Cleaning', to: '/services?category=Cleaning' },
                  { icon: '❄️', label: 'AC Repair', to: '/services?category=AC+Repair' },
                ].map(q => (
                  <Link key={q.label} to={q.to} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card flex flex-col items-center gap-2 hover:border-primary/30 hover:-translate-y-0.5 transition-all">
                    <span className="text-2xl">{q.icon}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{q.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {activeTab === 'bookings' && (
            <div className="animate-fade-in space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">My Bookings</h1>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-3">📋</div>
                  <h3 className="font-bold text-slate-700 dark:text-white">No bookings found</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {statusFilter !== 'All' ? `No ${statusFilter} bookings.` : 'Start by booking a service!'}
                  </p>
                  <Link to="/services" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map(b => {
                    const svc = services.find(s => String(s.id) === String(b.serviceId));
                    const prov = providers.find(p => p.id === b.providerId);
                    return (
                      <div key={b.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                          {svc?.category === 'Electrician' ? '⚡' : svc?.category === 'Plumber' ? '🔧' : svc?.category === 'Cleaning' ? '🧹' : '🏠'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-slate-800 dark:text-white truncate">{svc?.title}</p>
                            <Badge status={b.status} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.date)} at {b.time}</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{prov?.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</span>
                          {b.status === 'Completed' && (
                            <button onClick={() => handleRebook(b)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                              <RefreshCw className="w-3 h-3 shrink-0" /> Rebook
                            </button>
                          )}
                          {b.status === 'Completed' && !submittedServiceIds.has(String(b.serviceId)) && (
                            <button onClick={() => openReviewModal(b)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition-colors border border-amber-200">
                              <Star className="w-3 h-3 shrink-0" /> Review
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── MY REVIEWS ── */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">My Reviews</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Rate and review services you've used.</p>
                </div>
              </div>

              {/* Pending Reviews — completed bookings without a review */}
              {completedBookings.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20">
                    <h2 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Services You Can Review
                    </h2>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Share your experience to help others.</p>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-700">
                    {completedBookings.map(b => {
                      const svc = services.find(s => String(s.id) === String(b.serviceId));
                      const alreadyReviewed = submittedServiceIds.has(String(b.serviceId));
                      return (
                        <div key={b.id} className="flex items-center gap-4 px-6 py-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                            {svc?.category === 'Electrician' ? '⚡' :
                              svc?.category === 'Plumber' ? '🔧' :
                                svc?.category === 'Cleaning' ? '🧹' :
                                  svc?.category === 'AC Repair' ? '❄️' : '🏠'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{svc?.title}</p>
                            <p className="text-xs text-slate-500">{formatDate(b.date)} · {formatCurrency(b.amount)}</p>
                          </div>
                          {alreadyReviewed ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-success px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                            </span>
                          ) : (
                            <button
                              onClick={() => openReviewModal(b)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-500 hover:text-white transition-colors border border-amber-200 dark:border-amber-700"
                            >
                              <Star className="w-3.5 h-3.5" /> Rate Now
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submitted Reviews */}
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : userReviews.length === 0 ? (
                completedBookings.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-3">⭐</div>
                    <h3 className="font-bold text-slate-700 dark:text-white">No Reviews Yet</h3>
                    <p className="text-slate-500 text-sm mt-1">Complete a booking first, then come back to leave a review.</p>
                    <Link to="/services" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">
                      Browse Services
                    </Link>
                  </div>
                )
              ) : (
                <div>
                  <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase tracking-wider">Your Submitted Reviews</h2>
                  <div className="space-y-4">
                    {userReviews.map(r => {
                      const svc = services.find(s => String(s.id) === String(r.serviceId));
                      return (
                        <div key={r._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                                {svc?.category === 'Electrician' ? '⚡' :
                                  svc?.category === 'Plumber' ? '🔧' :
                                    svc?.category === 'Cleaning' ? '🧹' : '🏠'}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-white text-sm">{svc?.title || `Service #${r.serviceId}`}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {[1, 2, 3, 4, 5].map(n => (
                                    <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                                  ))}
                                  <span className="text-xs text-slate-500 ml-1">({r.rating}/5)</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.approved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                {r.approved ? '✓ Approved' : '⏳ Pending'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                          {r.comment && (
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl italic">
                              "{r.comment}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FAVORITES ── */}
          {activeTab === 'favorites' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Saved Services</h1>
                <Link to="/services" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                  Browse More <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {favoriteServices.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-3">❤️</div>
                  <h3 className="font-bold text-slate-700 dark:text-white">No Favorites Yet</h3>
                  <p className="text-slate-500 text-sm mt-1">Browse services and tap ❤️ to save them here.</p>
                  <Link to="/services" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Browse Services</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteServices.map(s => {
                    const prov = providers.find(p => String(p.id) === String(s.providerId));
                    return (
                      <div key={s.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-5 flex gap-4">
                        {s.image
                          ? <img src={s.image.startsWith('http') ? s.image : `http://localhost:3000${s.image}`} alt={s.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                          : <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">🏠</div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 dark:text-white text-sm mb-1 truncate">{s.title}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-300">{s.rating}</span>
                          </div>
                          <p className="text-sm font-bold text-primary">{formatCurrency(s.price)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link to={`/services/${s.id}`} state={{ service: s, provider: prov }} className="text-xs text-primary font-semibold hover:underline">View</Link>
                          <button onClick={() => handleRemoveFavorite(s.id)} className="text-xs text-danger font-semibold hover:underline">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <ProfileTab />
          )}

          {/* ── PAYMENTS ── */}
          {activeTab === 'payments' && (
            <div className="animate-fade-in space-y-6">
              <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-white">Payment History</h1>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        {['Booking ID', 'Service', 'Date', 'Amount', 'Status'].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {userBookings.map(b => {
                        const svc = services.find(s => String(s.id) === String(b.serviceId));
                        return (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-primary">{b.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{svc?.title}</td>
                            <td className="px-6 py-4 text-slate-500">{formatDate(b.date)}</td>
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</td>
                            <td className="px-6 py-4"><Badge status={b.status} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── REVIEW MODAL ── */}
      {reviewModal && (
        <LeaveReviewModal
          booking={reviewModal.booking}
          service={reviewModal.service}
          user={user}
          onClose={() => setReviewModal(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}
