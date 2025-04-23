// src/services/authService.js
// Service which will handle API calls to your backend: logIn, logOut, registering users
// Getting the login token, getting the current logged-in user
// Contains the functions to login, register, logout

const API_URL = "http://localhost:8080";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Attach token to the header
  };
};

const authService = {
  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Login function (authenticate the user)
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      // Make sure to use the correct endpoint path
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();

    // Store user data and token in localStorage
    localStorage.setItem("user", JSON.stringify(data.user)); // You can store just the necessary user data here
    localStorage.setItem("token", data.response); // Store the token (check if the response field matches the token you return)

    return data; // Return the response data so the context can process it
  },

  // Register function (create a new user)
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      // Fixed endpoint to match backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Registration failed");
    const data = await response.json();

    return data;
  },

  // Logout function (clear stored data)
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  // Check if a user is authenticated by checking localStorage
  isAuthenticated: () => {
    return !!localStorage.getItem("user");
  },
};

export { authService };
