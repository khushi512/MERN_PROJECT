import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-white text-5xl sm:text-6xl font-extrabold mb-6">
        Welcome to DesignHire
      </h1>
      <p className="text-white text-lg sm:text-xl max-w-xl mb-10">
        Connect with top creative talent and discover stunning interior design projects that inspire.
      </p>
      <div className="flex gap-6">
        <Link
          to="/signup"
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
        <Link
          to="/signin"
          className="text-white font-semibold px-8 py-3 rounded-lg border border-white hover:bg-white hover:text-blue-600 transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Landing;
