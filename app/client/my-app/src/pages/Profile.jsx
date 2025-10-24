import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, updateUserProfile } from "../apiCalls/authCalls";
import Navbar from "../components/NavBar";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [user, setUser] = useState(userData || null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Editable form fields
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    bio: "",
    skills: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getCurrentUser();
        setUser(profileData);
        setFormData({
          name: profileData.name || "",
          userName: profileData.userName || "",
          bio: profileData.bio || "",
          skills: profileData.skills?.join(", ") || "",
        });
      } catch (error) {
        setErrorMsg(error.message || "Unable to load profile details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        name: formData.name,
        userName: formData.userName,
        bio: formData.bio,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };
      const updatedUser = await updateUserProfile(updatedData);
      setUser(updatedUser);
      dispatch(setUserData(updatedUser));
      setIsEditing(false);
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <h3 className="text-white font-semibold text-lg animate-pulse">
            Loading profile details...
          </h3>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-[90%] sm:w-[400px]">
            <h2 className="text-red-500 text-lg font-semibold mb-3">
              {errorMsg}
            </h2>
            <p className="text-gray-600">
              Please try again later or refresh the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h2 className="text-emerald-600 text-xl font-semibold">
              Profile not found.
            </h2>
            <p className="text-gray-500 mt-2">Sign in to view your details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500 flex flex-col relative">
      <Navbar />

      <main className="flex-1 pt-24 py-10 px-5 flex flex-col items-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg px-8 py-10 mb-8 hover:shadow-xl transition">
          <div className="flex items-center gap-5 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-green-400 to-blue-400 flex items-center justify-center text-white font-bold text-2xl">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-700">{user.name}</h1>
              <p className="text-green-600 font-medium">@{user.userName}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Bio</h3>
            <p className="text-gray-700 leading-relaxed">
              {user.bio || "No bio added yet."}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No skills listed yet.</span>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEditClick}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-blue-600 mb-4 text-center">
              Edit Profile
            </h2>

            <div className="flex flex-col gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2"
                placeholder="Full Name"
              />
              <input
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2"
                placeholder="Username"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 resize-none"
                rows="3"
                placeholder="Bio"
              />
              <input
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2"
                placeholder="Skills (comma separated)"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
