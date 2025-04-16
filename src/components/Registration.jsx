import React, { useState } from "react";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "", 
    
  });

  const [loading, setLoading] = useState(false); // Loading state for button
  const [successMessage, setSuccessMessage] = useState(""); // Success message for feedback
  const [errorMessage, setErrorMessage] = useState(""); // Error message for feedback

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    setSuccessMessage(""); // Clear any previous success message
    setErrorMessage(""); // Clear any previous error message

    try {
      // Replace the URL with your backend API endpoint
      const response = await fetch("http://localhost:5000/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration Successful:", result);
        setSuccessMessage("Registration Successful!");
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
        
        });
      } else {
        const error = await response.json();
        setErrorMessage(`Registration failed: ${error.message}`);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-blue-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4 text-green-800">
        USER TRACKING REGISTRATION
      </h1>

      {/* Feedback Messages */}
      {successMessage && (
        <p className="mt-4 text-green-600 text-center font-medium">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-4 text-red-600 text-center font-medium">
          {errorMessage}
        </p>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label
            htmlFor="Username"
            className="block text-gray-600 mb-2 font-medium"
          >
            Username
          </label>
          <input
            type="Username" 
            id="Username"
            name="Username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your Username"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-600 mb-2 font-medium"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
      
        <div>
          <label
            htmlFor="phone"
            className="block text-gray-600 mb-2 font-medium"
          >
            Phone Number
          </label>
          <div className="flex">
            <select
              name="countryCode"
              id="countryCode"
              onChange={handleInputChange}
              className="border border-blue-300 rounded-l-md p-2 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="+254">Kenya (+254)</option>
              
            </select>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
          <label
            htmlFor="password"
            className="block text-gray-600 mb-2 font-medium"
          >
        Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your Password"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
          
        </div>
        
        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-purple-600 ${
            loading ? "cursor-not-allowed bg-gray-400" : ""
          }`}
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Registration;
