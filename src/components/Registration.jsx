import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [countryCode, setCountryCode] = useState("+254");
  const [rawPhone, setRawPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setRawPhone(value);
      setFormData({ ...formData, phoneNumber: countryCode + value });
    } else if (name === "countryCode") {
      setCountryCode(value);
      setFormData({ ...formData, phoneNumber: value + rawPhone });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration Successful:", result);
        setSuccessMessage("Registration Successful!");
        localStorage.setItem("phoneNumber", formData.phoneNumber);
        localStorage.setItem("email", formData.email);
        navigate("/verify-otp"); // if using react-router

        setFormData({
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
        setRawPhone("");
      } else {
        const error = await response.json();
        setErrorMessage(`Registration failed: ${error.message}`);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to login page
  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-blue-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4 text-green-800">
        USER TRACKING REGISTRATION
      </h1>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-gray-600 mb-2 font-medium"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
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
              value={countryCode}
              onChange={handleInputChange}
              className="border border-blue-300 rounded-l-md p-2 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="+254">Kenya (+254)</option>
              {/* Add other countries if needed */}
            </select>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={rawPhone}
              onChange={handleInputChange}
              placeholder="********"
              className="w-full border border-gray-300 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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

      {/* Login Button */}
      <div className="text-center mt-4">
        <button
          onClick={navigateToLogin}
          className="text-blue-600 hover:text-blue-800"
        >
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
};

export default Registration;
