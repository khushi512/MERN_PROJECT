import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useCurrentUser from "../../hooks/useCurrentUser";
import { clearUserData } from "../redux/userSlice";
import { useState } from "react";

function Navbar() {
  useCurrentUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!userData) return null;

  const handleConfirmLogout = () => {
    dispatch(clearUserData());
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav
        className="
          fixed top-4 left-4 right-4
          glass rounded-2xl
          px-6 md:px-8 py-3 flex items-center justify-between
          z-50 transition-all duration-300
        "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="brand-gradient-text font-extrabold text-2xl tracking-wide">
            DesignHire
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 md:gap-6 items-center">
          <Link
            to="/home"
            className="text-slate-700 hover:text-teal-700 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/explore"
            className="text-slate-700 hover:text-teal-700 font-medium transition"
          >
            Explore
          </Link>
          <Link
            to="/saved"
            className="text-slate-700 hover:text-teal-700 font-medium transition"
          >
            Saved
          </Link>
          <Link
            to="/profile"
            className="text-slate-700 hover:text-teal-700 font-medium transition"
          >
            Profile
          </Link>

          <div className="hidden sm:block font-medium text-slate-700">
            Hello, {userData.name}!
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="card p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmLogout}
                className="btn-primary"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-ghost"
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

export default Navbar;
