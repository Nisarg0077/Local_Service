import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * PrivateRoute: Protects routes based on auth and optional role.
 * - redirects to /login if not authenticated
 * - redirects to / if authenticated but wrong role
 */
export default function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard
    const dashMap = {
      customer: '/user/dashboard',
      provider: '/provider/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashMap[user?.role] || '/'} replace />;
  }

  return children;
}
