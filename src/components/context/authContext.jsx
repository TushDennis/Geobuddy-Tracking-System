// src/contexts/AuthContext.jsx 
//  Component creates a context to manage the authentication state on the project

import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    
    // Check if user is already logged in on app load
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);
  
  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.register(userData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.login(credentials);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};