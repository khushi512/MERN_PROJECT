import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUserData } from "../redux/userSlice";
import { useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiCalls/config";
import {
  Moon,
  Sun,
  Home,
  Briefcase,
  ClipboardCheck,
  Bookmark,
  User,
} from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContext.jsx";

function NavBarApplicant() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector((state) => state.user);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!userData) return null;

  const navItem = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      location.pathname === path
        ? isDarkMode
          ? "bg-cyan-600/20 text-cyan-400 font-semibold"
          : "bg-cyan-50 text-cyan-600 font-semibold"
        : isDarkMode
        ? "text-gray-300 hover:text-white hover:bg-slate-800"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
    }`;


  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const api = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
      });
      await api.post("/api/auth/logout");
    } catch (e) {
      console.log("Logout error", e);
    }

    dispatch(clearUserData());
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-lg px-8 py-4 flex items-center justify-between
          ${isDarkMode
            ? "bg-slate-900/95 border-slate-800"
            : "bg-white/95 border-gray-200"
          }`}
      >
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-wide
            bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500
            bg-clip-text text-transparent">
            DesignHire
          </span>
        </Link>

        {/* Navigation (center) */}
        <div className="flex items-center gap-6">
          <Link to="/home" className={navItem("/home")}>
            <Home size={18} />
            Home
          </Link>

          <Link to="/explore" className={navItem("/explore")}>
            <Briefcase size={18} />
            Explore
          </Link>

          <Link to="/applied-jobs" className={navItem("/applied-jobs")}>
            <ClipboardCheck size={18} />
            Applied
          </Link>

          <Link to="/saved" className={navItem("/saved")}>
            <Bookmark size={18} />
            Saved
          </Link>

          <Link to="/profile" className={navItem("/profile")}>
            <User size={18} />
            Profile
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
  onClick={toggleDarkMode}
  title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all
    ${
      isDarkMode
        ? "bg-slate-800 hover:bg-slate-700 shadow-inner"
        : "bg-gray-100 hover:bg-gray-200 shadow-sm"
    }`}
>
  {isDarkMode ? (
    <Sun size={18} className="text-yellow-400" />
  ) : (
    <Moon size={18} className="text-gray-700" />
  )}
</button>


          {/* Logout */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLoggingOut}
            className={`px-4 py-2 rounded-lg text-sm font-medium
    border transition
    ${isDarkMode
                ? "border-slate-700 text-gray-200 hover:bg-slate-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>

        </div>
      </nav>

      {/* Logout Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Are you sure?
            </h2>

            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg text-white
                  bg-gradient-to-r from-teal-400 to-cyan-500 hover:opacity-90"
              >
                Logout
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBarApplicant;
