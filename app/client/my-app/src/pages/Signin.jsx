import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInUser } from "../apiCalls/authCalls";
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Briefcase, Users, Zap } from "lucide-react";

function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName || !password) {
      setError("Please enter username and password");
      return;
    }

    setIsLoading(true);
    try {
      const data = await signInUser({ userName, password });
      console.log("Full SignIn response:", data);
      console.log("Response type:", typeof data);
      console.log("Has user property:", data?.user);

      if (data && data.user) {
        // Dispatch with proper format: { user: {...} }
        dispatch(setUserData({ user: data.user }));
        // Delay navigation slightly to ensure Redux state is updated
        setTimeout(() => navigate('/home'), 100);
      } else if (data?.message) {
        // API returned an error message
        setError(data.message);
      } else {
        setError("Sign in failed");
      }
    } catch (error) {
      console.error("SignIn catch error:", error);
      setError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#48c6ef]/10 to-[#6f86d6]/10 flex-col justify-center items-center px-12 py-12">
        <div className="max-w-sm">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent mb-6">
            DesignHire
          </h1>
          <p className="text-xl font-semibold text-gray-900 mb-12">
            Connect with Design Talent and Opportunities
          </p>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Find Opportunities</h3>
                <p className="text-sm text-gray-600">Browse curated design jobs matched to your skills</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Connect Directly</h3>
                <p className="text-sm text-gray-600">Collaborate with designers or recruiters in real-time</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Grow Your Career</h3>
                <p className="text-sm text-gray-600">Build your portfolio and land amazing projects</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              ✓ Join thousands of designers and recruiters already on DesignHire
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] bg-clip-text text-transparent mb-2">
              DesignHire
            </h1>
            <p className="text-gray-600 text-sm">Design opportunities await</p>
          </div>

          {/* Form Card */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#48c6ef] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#48c6ef] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#48c6ef] hover:text-[#6f86d6] font-medium transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-[#48c6ef] hover:text-[#6f86d6] transition"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
