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
          bg-white
          border border-gray-200
          rounded-2xl
          shadow-xl
          px-8 py-3 flex items-center justify-between
          z-50 transition-all duration-300
        "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-transparent bg-clip-text font-extrabold text-2xl tracking-wide"
            style={{
              backgroundImage: "linear-gradient(to right, #48c6ef, #6f86d6)",
            }}
          >
            DesignHire
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link
            to="/home"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/explore"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Explore
          </Link>
          <Link
            to="/saved"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Saved
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Profile
          </Link>

          <div className="font-medium text-gray-700">
            Hello, {userData.name}!
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmLogout}
                className="bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] text-white px-4 py-2 rounded-md hover:opacity-90 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
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
