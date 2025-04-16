// src/components/auth/ProtectedRoute.jsx
// a wrapper component to protect routes that require authentication

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
}