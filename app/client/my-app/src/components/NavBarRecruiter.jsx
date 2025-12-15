import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../redux/userSlice";
import { Moon, Sun, Home, Briefcase, Users, User } from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContext";

function NavBarRecruiter() {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  if (!user) {
    return (
      <nav className={`px-8 py-4 shadow-lg ${
        isDarkMode ? 'bg-slate-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          DesignHire
        </span>
      </nav>
    );
  }

  const handleConfirmLogout = () => {
    dispatch(clearUserData());
    localStorage.removeItem("user");
    navigate("/");
  };

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      location.pathname === path
        ? isDarkMode
          ? "bg-cyan-600/20 text-cyan-400 font-semibold"
          : "bg-cyan-50 text-cyan-600 font-semibold"
        : isDarkMode
        ? "text-gray-300 hover:text-white hover:bg-slate-800"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 backdrop-blur-md border-b shadow-lg px-8 py-4 flex items-center justify-between z-50 ${
        isDarkMode 
          ? 'bg-slate-900/95 border-slate-800' 
          : 'bg-white/95 border-gray-200'
      }`}>

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent tracking-wide">
            DesignHire
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 text-[15px]">
          <Link to="/home" className={navLinkClass("/home")}>
            <Home size={18} />
            Home
          </Link>
          <Link to="/my-jobs" className={navLinkClass("/my-jobs")}>
            <Briefcase size={18} />
            Jobs
          </Link>
          <Link to="/all-applicants" className={navLinkClass("/all-applicants")}>
            <Users size={18} />
            Applicants
          </Link>
          <Link to="/profile" className={navLinkClass("/profile")}>
            <User size={18} />
            Profile
          </Link>
        </div>

        {/* Dark Mode Toggle & Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Confirm Logout Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 ${
            isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Confirm Logout
            </h3>
            <p className={`mb-6 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Are you sure you want to logout from your account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="px-5 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
                onClick={handleConfirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBarRecruiter;

