// src/services/httpClient.js
// An HTTP client with auth token interceptor: Adding API authorization for protected endpoints
// Adds the user token to request automattically 
 
import { authService } from './authService';

export const httpClient = {
  get: async (url) => {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - log the user out of the System
        authService.logout();
        window.location.href = '/'; // Force redirect to Login Page
      }
      throw new Error('API request failed');
    }
    
    return response.json();
  },
  
  post: async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - Log the user out of the System
        authService.logout();
        window.location.href = '/'; // Force redirect to Login Page
      }
      throw new Error('API request failed');
    }
    
    return response.json();
  },
  
  // Add put, delete, etc. methods similarly
};