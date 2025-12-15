import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../apiCalls/authCalls";
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Briefcase, Users, Zap } from "lucide-react";

function SignUp() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("applicant");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !userName || !email || !password || !userType) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const data = await signUpUser({ name, userName, email, password, userType });
      console.log("SignUp response:", data);
      
      if (data && data.user) {
        // Dispatch with proper format: { user: {...} }
        dispatch(setUserData({ user: data.user }));
        // Delay navigation slightly to ensure Redux state is updated
        setTimeout(() => navigate('/home'), 100);
      } else {
        setError(data?.message || "Sign up failed");
      }
    } catch (error) {
      setError("Sign up failed. Please try again.");
      console.error("SignUp error:", error);
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
            Join the Design Community
          </p>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Discover Jobs</h3>
                <p className="text-sm text-gray-600">Browse curated design opportunities suited to your skills</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Network & Collaborate</h3>
                <p className="text-sm text-gray-600">Connect with talented designers and leading brands</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Advance Your Career</h3>
                <p className="text-sm text-gray-600">Land exciting projects and showcase your talent</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              ✨ Free for designers and recruiters. Join today!
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
            <p className="text-gray-600 text-sm">Join the design community</p>
          </div>

          {/* Form Card */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Get started in minutes</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  I am a
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUserType("applicant")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition border-2 ${
                      userType === "applicant"
                        ? "bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white border-[#48c6ef]"
                        : "bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400"
                    }`}
                    disabled={isLoading}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("recruiter")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition border-2 ${
                      userType === "recruiter"
                        ? "bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white border-[#48c6ef]"
                        : "bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400"
                    }`}
                    disabled={isLoading}
                  >
                    Recruiter
                  </button>
                </div>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#48c6ef] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="johndoe"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#48c6ef] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
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
                    placeholder="At least 6 characters"
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

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{" "}
              <a href="#" className="text-[#48c6ef] hover:text-[#6f86d6] transition">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#48c6ef] hover:text-[#6f86d6] transition">
                Privacy
              </a>
            </p>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-bold text-[#48c6ef] hover:text-[#6f86d6] transition"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;