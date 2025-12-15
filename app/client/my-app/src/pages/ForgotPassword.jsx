import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../apiCalls/authCalls"; // Use your configured axios instance

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // success, error, loading
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter your registered email.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await forgotPassword(email);
      setStatus("success");
      setMessage(
        res.data?.message ||
          "If this email is registered, you'll receive password reset instructions."
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Failed to send reset instructions. Please try again."
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] px-4">
      <div className="w-[95%] sm:max-w-[400px] bg-white/95 rounded-2xl shadow-md p-6 flex flex-col items-center gap-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Forgot Password</h1>
        <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full h-[44px] px-3 rounded-md border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button
            type="submit"
            className="w-full h-[44px] mt-2 rounded-lg font-semibold bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white hover:opacity-90 active:scale-[0.99] transition shadow-md"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-sm ${
              status === "error"
                ? "text-red-500"
                : status === "success"
                ? "text-green-600"
                : "text-gray-700"
            } text-center`}
          >
            {message}
          </div>
        )}

        <div className="mt-4 text-center text-gray-600 text-sm">
          Remembered your password?{" "}
          <Link to="/signin" className="text-gray-900 font-medium underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
