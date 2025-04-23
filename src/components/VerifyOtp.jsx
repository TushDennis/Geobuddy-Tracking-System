import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode: otp, // ✅ Corrected key
        }),
      });

      if (response.ok) {
        setSuccessMessage("OTP verified successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Verification failed.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMessage("Email not found. Please go back and register again.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/auth/resend?email=${email}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setSuccessMessage("A new OTP has been sent to your email.");
      } else {
        const data = await response.text();
        setErrorMessage(data || "Failed to resend OTP.");
      }
    } catch (error) {
      setErrorMessage("Could not resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-blue-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
        Verify OTP
      </h2>

      {successMessage && (
        <p className="text-green-600 text-center">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-center">{errorMessage}</p>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-gray-700 mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 ${
            loading ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="text-blue-600 hover:underline disabled:text-gray-400"
        >
          {loading ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
