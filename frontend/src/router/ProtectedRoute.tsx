import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/ui';

// Protects routes that require authentication
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen message="Loading HerCare..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Redirects logged-in users away from auth pages
export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen message="Loading HerCare..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
