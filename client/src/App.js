import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import PrivateRoute from './components/common/PrivateRoute';
import { PageLoader } from './components/common/LoadingSpinner';
import ApproveReviews from './pages/ApproveReviews';

import Login from './pages/Login';
import Register from './pages/Register';

// Pages (lazy loaded for performance)
const Home = React.lazy(() => import('./pages/Home'));

const ServicesList = React.lazy(() => import('./pages/ServicesList'));
const ServiceDetails = React.lazy(() => import('./pages/ServiceDetails'));
const Booking = React.lazy(() => import('./pages/Booking'));
const UserDashboard = React.lazy(() => import('./pages/dashboards/UserDashboard'));
const ProviderDashboard = React.lazy(() => import('./pages/dashboards/ProviderDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/dashboards/AdminDashboard'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Informational Pages (lazy loaded)
const About = React.lazy(() => import('./pages/About'));
const Careers = React.lazy(() => import('./pages/Careers'));
const Blog = React.lazy(() => import('./pages/Blog'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const AddService = React.lazy(() => import('./pages/services/AddService'));
const EditService = React.lazy(() => import('./pages/services/EditService'));

/** Main layout: Navbar + page outlet + Footer + scroll-to-top */
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </div>
  );
}

/** Dashboard layout: full-height without footer wrapping */
function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <Outlet />
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── PUBLIC ROUTES ── */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="services" element={<ServicesList />} />
                  <Route path="services/:id" element={<ServiceDetails />} />

                  {/* Auth pages */}
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="add-service" element={<AddService />} />
                  <Route path="edit-service/:serviceId" element={<EditService />} />
                  <Route path="admin/approve-reviews" element={<ApproveReviews />} />

                  {/* ── INFORMATIONAL PAGES ── */}
                  <Route path="about" element={<About />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="help" element={<HelpCenter />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="contact" element={<ContactUs />} />
                </Route>

                {/* ── PROTECTED BOOKING ── */}
                <Route path="/booking" element={<MainLayout />}>
                  <Route index element={
                    <PrivateRoute roles={['customer', 'admin']}>
                      <Booking />
                    </PrivateRoute>
                  } />
                </Route>

                {/* ── PROTECTED DASHBOARDS ── */}
                <Route path="/" element={<DashboardLayout />}>
                  <Route path="user/dashboard" element={
                    <PrivateRoute roles={['customer']}>
                      <UserDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="provider/dashboard" element={
                    <PrivateRoute roles={['provider']}>
                      <ProviderDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="admin/dashboard" element={
                    <PrivateRoute roles={['admin']}>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />

                  <Route path="/admin/dashboard/:activeTabfromURL" element={
                    <PrivateRoute roles={['admin']}>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />

                  <Route path="/provider/dashboard/:activeTabfromURL" element={
                    <PrivateRoute roles={['provider']}>
                      <ProviderDashboard />
                    </PrivateRoute>
                  } />
                </Route>

                {/* ── 404 ── */}
                <Route path="*" element={<MainLayout />}>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
