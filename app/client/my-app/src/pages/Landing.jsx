import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen brand-gradient-bg flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-white text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-xl">
        Welcome to DesignHire
      </h1>
      <p className="text-white/95 text-lg sm:text-xl max-w-xl mb-10">
        Connect with top creative talent and discover stunning interior design projects that inspire.
      </p>
      <div className="flex gap-6">
        <Link
          to="/signup"
          className="btn-primary"
        >
          Get Started
        </Link>
        <Link
          to="/signin"
          className="btn-outline border-white/70 text-white hover:bg-white hover:text-teal-700"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Landing;
