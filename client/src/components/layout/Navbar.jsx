import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  User,
  Home,
  Heart,
  Settings,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import { getInitials, formatRelativeTime } from "../../utils";
import toast from "react-hot-toast";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "provider"
        ? "/provider/dashboard"
        : "/user/dashboard";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
  ];

  // if (isAuthenticated) {
  //   if (user?.role === 'customer') {
  //     navLinks.push({ to: '/user/dashboard', label: 'Bookings', state: { activeTab: 'bookings' } });
  //     navLinks.push({ to: '/user/dashboard', label: 'Favorites', state: { activeTab: 'favorites' } });
  //   } else if (user?.role === 'provider') {
  //     navLinks.push({ to: '/provider/dashboard', label: 'My Services', state: { activeTab: 'services' } });
  //     navLinks.push({ to: '/provider/dashboard', label: 'Bookings', state: { activeTab: 'bookings' } });
  //   } else if (user?.role === 'admin') {
  //     navLinks.push({ to: '/admin/dashboard', label: 'Users', state: { activeTab: 'users' } });
  //     navLinks.push({ to: '/admin/dashboard', label: 'Providers', state: { activeTab: 'providers' } });
  //     navLinks.push({ to: '/admin/dashboard', label: 'Services', state: { activeTab: 'services' } });
  //   }
  // }

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-[999] transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-slate-900/95 shadow-md" : "bg-white/80 dark:bg-slate-900/80"} backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/80`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="SmartLocal Home"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-heading font-bold text-slate-900 dark:text-white">
            Smart<span className="text-primary">Local</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to + (link.state?.activeTab || "")}
              to={link.to}
              state={link.state}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to) &&
                (!link.state ||
                  location.state?.activeTab === link.state?.activeTab)
                  ? "text-primary bg-primary/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to={dashboardLink}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Home className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              {/* <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                  aria-label={`${unreadCount} unread notifications`}
                  className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-slow">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-scale-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-primary font-semibold hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-sm">No notifications</div>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                          >
                            <span className="text-xl mt-0.5 shrink-0">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{n.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div> */}

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileOpen((o) => !o);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={
                        user.avatar.startsWith("http")
                          ? user.avatar
                          : `http://localhost:3000${user.avatar}`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden lg:block max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-scale-in">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                      <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
                        {user?.role}
                      </span>
                    </div>
                    <div className="p-2">
                      <Link
                        to={dashboardLink}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Home className="w-4 h-4" /> Dashboard
                      </Link>
                      {/* <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link> */}
                      <Link
                        to={
                          user?.role === "customer"
                            ? "/user/dashboard"
                            : user?.role === "provider"
                              ? "/provider/dashboard"
                              : "/dashboard"
                        }
                        state={{ activeTab: "profile" }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      {user?.role === "customer" && (
                        <Link
                          to="/user/dashboard"
                          state={{ activeTab: "favorites" }}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Heart className="w-4 h-4" /> Favorites
                        </Link>
                      )}
                      <hr className="my-1 border-slate-100 dark:border-slate-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-indigo-700 transition-all hover:shadow-glow active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-2 animate-slide-up">
          {navLinks.map((link) => (
            <Link
              key={link.to + (link.state?.activeTab || "")}
              to={link.to}
              state={link.state}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.to) && (!link.state || location.state?.activeTab === link.state?.activeTab) ? "bg-primary/10 text-primary" : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-slate-500">Dark Mode</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-500" />
              )}
            </button>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2">
                {user?.avatar ? (
                  <img
                    src={
                      user.avatar.startsWith("http")
                        ? user.avatar
                        : `http://localhost:3000${user.avatar}`
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-primary/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <Link
                to={dashboardLink}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Home className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                className="flex-1 text-center py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2.5 bg-primary text-white rounded-xl text-sm font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
