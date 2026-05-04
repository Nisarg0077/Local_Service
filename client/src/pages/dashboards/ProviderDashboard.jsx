import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Home,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  ToggleLeft,
  Server,
  Star,
  User,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils";

// Subcomponents
import OverviewTab from "../../components/provider/OverviewTab";
import ServicesTab from "../../components/provider/ServicesTab";
import BookingsTab from "../../components/provider/BookingsTab";
import ReviewsTab from "../../components/provider/ReviewsTab";
import ProfileTab from "../../components/common/ProfileTab";

import { providerEarningsData } from "../../data/mockData";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "services", label: "My Services", icon: Server },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "profile", label: "Profile", icon: User },
];

export default function ProviderDashboard() {
  const { activeTabfromURL } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const validTabs = NAV_ITEMS.map((item) => item.id);
  const [activeTab, setActiveTab] = useState(() => {
    return validTabs.includes(activeTabfromURL) ? activeTabfromURL : "overview";
  });

  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // States
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const location = useLocation();
  const state = location.state || {};

  const [providerStats, setProviderStats] = useState({
    rating: 4.8,
    experience: 5,
    area: "City Center",
  });

  useEffect(() => {
    if (state.activeTab === "profile") {
      setActiveTab("profile");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (activeTabfromURL && validTabs.includes(activeTabfromURL)) {
      setActiveTab(activeTabfromURL);
    }
  }, [activeTabfromURL, validTabs]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchServices();
    fetchBookings();
    fetchReviews();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/provider/dashboard/${tabId}`, { replace: true });
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out from Provider");
    navigate("/");
  };

  const toggleAvailability = () => {
    setIsAvailable((p) => !p);
    toast.success(
      isAvailable
        ? "You are now offline"
        : "You are now available for bookings!",
    );
  };

  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      if (tab === "overview") {
        if (!services.length) await fetchServices();
        if (!bookings.length) await fetchBookings();
        if (!reviews.length) await fetchReviews();
      } else if (tab === "services" && services.length === 0) {
        await fetchServices();
      } else if (tab === "bookings" && bookings.length === 0) {
        await fetchBookings();
        // Fallback for bookings matching my services if they were fetched just now but fetchBookings needs my services
        if (services.length === 0) await fetchServices();
      } else if (tab === "reviews" && reviews.length === 0) {
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error fetching tab data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const id = user?.uid;
      // console.log(id);
      const res = await api.get(
        `http://localhost:3000/api/services/provider/${id}`,
      );
      // console.log(res.data);
      // const myServices = res.data.filter(s => s.providerId === user?._id || s.providerId === user?.id || String(s.providerId) === String(user?._id));
      // if ((s => s.providerId === user?._id || s.providerId === user?.id || String(s.providerId) === String(user?._id))) {
      //   console.log(user?.id);
      // }
      setServices(res.data);
    } catch (e) {
      toast.error("Failed to fetch services");
    }
  };

  const fetchBookings = async () => {
    try {
      const id = user?.uid;
      const res = await api.get(
        `http://localhost:3000/api/bookings/provider/${id}`,
      );
      // const myServicesIds = services.length > 0 ? services.map(s => s._id || s.id) : (await api.get('/services')).data.filter(s => s.providerId === user?._id || s.providerId === user?.id).map(s => s._id);
      // const myBookings = res.data.filter(b => b.providerId === user?._id || b.providerId === user?.id || myServicesIds.includes(b.serviceId));
      setBookings(res.data);
    } catch (e) {
      toast.error("Failed to fetch bookings");
    }
  };

  const fetchReviews = async () => {
    try {
      // const serviceIds = services.map(s => s.id);
      const id = user?.uid;
      // console.log(id);
      const servicesData = await api.get(
        `http://localhost:3000/api/services/provider/${id}`,
      );
      // console.log(servicesData.data.map(s => s.id));
      if (servicesData.data.length === 0) {
        setReviews([]);
        return;
      } else {
        const res = await api.get(
          `http://localhost:3000/api/reviews/approved/${servicesData.data.map((s) => s.id)}`,
        );
        setReviews(res.data);
      }
      // console.log(res.data);
      // const myServicesIds = services.length > 0 ? services.map(s => s._id || s.id) : (await api.get('/services')).data.filter(s => s.providerId === user?._id || s.providerId === user?.id).map(s => s._id);
      // const myReviews = res.data.filter(r => myServicesIds.includes(r.serviceId));
      // console.log(res.data);
    } catch (e) {
      toast.error("Failed to fetch reviews");
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await api.delete(`/${type}/${id}`);
      if (type === "services") fetchServices();
    } catch (error) {
      toast.error(`Failed to delete from ${type}`);
      console.error(error);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const originalBookings = [...bookings];
      setBookings(bookings.map((b) => (b._id === id ? { ...b, status } : b)));

      try {
        await api.put(`/bookings/${id}`, { status });
        toast.success("Booking status updated");
        fetchBookings();
      } catch (e) {
        toast.success("Booking status updated locally (API not updated)");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const stats = {
    totalBookings: bookings.length,
    accepted: bookings.filter((b) => b.status === "Accepted").length,
    completed: completedBookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    earnings: completedBookings.reduce(
      (sum, b) => sum + (Number(b.amount) || 2000),
      0,
    ),
  };

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Completed Jobs",
      value: stats.completed,
      icon: Home,
      color: "text-success",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Calendar,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: Calendar,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Total Services",
      value: services.length,
      icon: Server,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const renderTabContent = () => {
    if (loading && ["services", "bookings", "reviews"].includes(activeTab)) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            user={user}
            isAvailable={isAvailable}
            provider={providerStats}
            statCards={statCards}
            providerEarningsData={providerEarningsData}
            myBookings={bookings}
            allServices={services}
            onTabChange={handleTabChange}
          />
        );
      case "services":
        return <ServicesTab services={services} onDelete={deleteItem} />;
      case "bookings":
        return (
          <BookingsTab
            bookings={bookings}
            onUpdateStatus={updateBookingStatus}
          />
        );
      case "reviews":
        return <ReviewsTab reviews={reviews} />;
      case "profile":
        return <ProfileTab />;
      default:
        return (
          <OverviewTab
            statCards={statCards}
            user={user}
            myBookings={bookings}
            allServices={services}
            providerEarningsData={providerEarningsData}
            isAvailable={isAvailable}
            provider={providerStats}
            onTabChange={handleTabChange}
          />
        );
    }
  };

  return (
    <div className="dark:bg-slate-900 min-h-[calc(100vh-64px)] font-sans">
      <div className="flex flex-col md:flex-row min-h-full">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex flex-col pt-4">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              {user?.avatar ? (
                <img
                  src={
                    user.avatar.startsWith("http")
                      ? user.avatar
                      : `http://localhost:3000${user.avatar}`
                  }
                  alt=""
                  className="w-12 h-12 rounded-2xl ring-2 ring-primary/40 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                  {getInitials(user?.name || "P")}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white truncate">{user?.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user?.role || "Provider"}
                </p>
              </div>
            </div>
            {/* Availability Toggle */}
            <button
              onClick={toggleAvailability}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${isAvailable ? "bg-green-50 dark:bg-success/20 text-green-700 dark:text-success border border-green-200 dark:border-success/30" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"}`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${isAvailable ? "bg-success animate-pulse" : "bg-slate-500"}`}
                />
                {isAvailable ? "Available" : "Offline"}
              </span>
              <ToggleLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-4 md:p-8 overflow-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
