import React, { useState } from "react";
import { Link } from "react-router-dom";
import {forgotPassword} from "../apiCalls/authCalls"; // Use your configured axios instance

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
    <div className="min-h-screen flex flex-col justify-center items-center brand-gradient-bg px-4">
      <div className="w-full sm:max-w-[400px] card p-6">
        <h1 className="text-2xl mb-4 font-bold brand-gradient-text text-center">
          Forgot Password
        </h1>
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium mb-1">
              Enter your registered email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              className="h-[44px] px-3 rounded-md border border-teal-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none text-sm"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>
          <button type="submit" className="h-[44px] btn-primary" disabled={status === "loading"}>{status === "loading" ? "Sending..." : "Send Reset Link"}</button>
        </form>
        {message && (
          <div
            className={`mt-4 text-sm ${
              status === "error"
                ? "text-red-500"
                : status === "success"
                ? "text-green-600"
                : "text-blue-500"
            }`}
          >
            {message}
          </div>
        )}
        <div className="mt-4 text-center text-gray-600 text-sm">
          Remembered?{" "}
          <Link to="/signin" className="text-teal-700 font-medium underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
