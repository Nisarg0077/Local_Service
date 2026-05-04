import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PieChart as PieIcon,
  Users,
  Server,
  FileText,
  LogOut,
  TrendingUp,
  AlertTriangle,
  Activity,
  Download,
  UserCheck,
  UserX,
  Database,
  CheckCircle,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

// Import our new subcomponents
import OverviewTab from "../../components/admin/OverviewTab";
import ServicesTab from "../../components/admin/ServicesTab";
import ProvidersTab from "../../components/admin/ProvidersTab";
import UsersTab from "../../components/admin/UsersTab";
import BookingsTab from "../../components/admin/BookingsTab";
import ReviewsTab from "../../components/admin/ReviewsTab";
import CategoriesTab from "../../components/admin/CategoriesTab";

// Mock data (only used for dashboard charts where the backend may not have the endpoints yet)
import {
  revenueChartData,
  categoryChartData,
  recentActivityLog,
} from "../../data/mockData";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: PieIcon },
  { id: "services", label: "Service Management", icon: Server },
  { id: "providers", label: "Provider Management", icon: UserCheck },
  { id: "users", label: "User Management", icon: Users },
  { id: "bookings", label: "Booking Management", icon: FileText },
  { id: "reviews", label: "Review Management", icon: CheckCircle },
  { id: "categories", label: "Category Management", icon: Database },
];

export default function AdminDashboard() {
  const { activeTabfromURL } = useParams();
  const navigate = useNavigate();

  // Handle active tab state carefully to avoid undefined values
  const validTabs = NAV_ITEMS.map((item) => item.id);
  const [activeTab, setActiveTab] = useState(() => {
    return validTabs.includes(activeTabfromURL) ? activeTabfromURL : "overview";
  });

  const [loading, setLoading] = useState(false);

  // States for each section
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);

  // console.log(reviews);
  // Sync state if URL changes directly
  useEffect(() => {
    if (activeTabfromURL && validTabs.includes(activeTabfromURL)) {
      setActiveTab(activeTabfromURL);
    }
  }, [activeTabfromURL, validTabs]);

  // Optimal fetching - only fetch when a tab is active
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/admin/dashboard/${tabId}`, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("slms_token");
    localStorage.removeItem("slms_user");
    toast.success("Logged out from Admin");
    navigate("/");
  };

  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      if (tab === "overview") {
        // Fetch everything lazily for the overview counts if not already fetched
        if (!users.length) fetchUsers();
        if (!services.length) fetchServices();
        if (!bookings.length) fetchBookings();
        if (!providers.length) fetchProviders();
        if (!reviews.length) fetchReviews();
      } else if (tab === "services" && services.length === 0) {
        await fetchServices();
      } else if (tab === "providers" && providers.length === 0) {
        await fetchProviders();
      } else if (tab === "users" && users.length === 0) {
        await fetchUsers();
      } else if (tab === "bookings" && bookings.length === 0) {
        await fetchBookings();
      } else if (tab === "reviews" && reviews.length === 0) {
        await fetchReviews();
      } else if (tab === "categories" && categories.length === 0) {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error fetching tab data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (e) {
      toast.error("Failed to fetch services");
    }
  };
  const fetchProviders = async () => {
    try {
      const res = await api.get("/providers");
      setProviders(res.data);
    } catch (e) {
      toast.error("Failed to fetch providers");
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await api.get("/userroutes");
      setUsers(res.data);
    } catch (e) {
      toast.error("Failed to fetch users");
    }
  };
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (e) {
      toast.error("Failed to fetch bookings");
    }
  };
  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews/approved");
      setReviews(res.data);
    } catch (e) {
      toast.error("Failed to fetch reviews");
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (e) {
      toast.error("Failed to fetch categories");
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await api.delete(`/${type}/${id}`);

      // Refresh only the affected tab data
      if (type === "services") fetchServices();
      else if (type === "providers") fetchProviders();
      else if (type === "userroutes" || type === "users")
        fetchUsers(); // userroutes handles the api
      else if (type === "bookings") fetchBookings();
      else if (type === "reviews") fetchReviews();
      else if (type === "categories") fetchCategories();
    } catch (error) {
      toast.error(`Failed to delete from ${type}`);
      console.error(error);
    }
  };

  // Compile overview statistics
  const stats = {
    users: users.length,
    providers: providers.length,
    bookings: bookings.length,
    services: services.length,
    reviews: reviews.length,
  };

  // Render proper tab based on activeTab state
  const renderTabContent = () => {
    if (
      loading &&
      [
        "services",
        "providers",
        "users",
        "bookings",
        "reviews",
        "categories",
      ].includes(activeTab)
    ) {
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
            stats={stats}
            revenueChartData={revenueChartData}
            categoryChartData={categoryChartData}
            recentActivityLog={recentActivityLog}
            onTabChange={handleTabChange}
          />
        );
      case "services":
        return <ServicesTab services={services} onDelete={deleteItem} />;
      case "providers":
        return <ProvidersTab providers={providers} onDelete={deleteItem} />;
      case "users":
        return <UsersTab users={users} onDelete={deleteItem} />;
      case "bookings":
        return <BookingsTab bookings={bookings} onDelete={deleteItem} />;
      case "reviews":
        return <ReviewsTab reviews={reviews} onDelete={deleteItem} />;
      case "categories":
        return <CategoriesTab categories={categories} onDelete={deleteItem} />;
      default:
        return <OverviewTab stats={stats} onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="dark:bg-slate-900 min-h-full font-sans">
      <div className="flex flex-col md:flex-row min-h-full">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex flex-col pt-4">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-heading font-bold text-slate-800 dark:text-white text-xl">
              ⚡ Admin Panel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              SmartLocal Management
            </p>
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
            <div className="px-4 py-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
              <p className="text-xs text-green-600 dark:text-green-500 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{" "}
                All Systems Operational
              </p>
            </div>
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
