import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, updateUserProfile } from "../apiCalls/authCalls";
import NavBarApplicant from "../components/NavBarApplicant";
import { setUserData } from "../redux/userSlice";
import { ThemeContext } from "../contexts/ThemeContext";
import { Camera, X, Download, File } from "lucide-react";

const ProfileApplicant = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [user, setUser] = useState(userData || null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    bio: "",
    skills: "",
    profilePic: "",
    resumeUrl: "",
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
          profilePic: profileData.profilePic || "",
          resumeUrl: profileData.resumeUrl || "",
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
    // Show current profile pic as preview
    if (user?.profilePic) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
      setPreviewImage(`${backendUrl}${user.profilePic}`);
    } else {
      setPreviewImage(null);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle profile picture upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData({ ...formData, profilePic: file });
    }
  };

  // Handle resume upload
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Resume size must be less than 10MB");
        return;
      }

      setFormData({ ...formData, resumeUrl: file });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setUploadingImage(true);

      // Create FormData to handle file uploads
      const data = new FormData();
      data.append('name', formData.name);
      data.append('userName', formData.userName);
      data.append('bio', formData.bio);
      data.append('skills', formData.skills.split(",").map((s) => s.trim()).filter(Boolean));

      // Only append profilePic if it's a File object (new upload)
      if (formData.profilePic && typeof formData.profilePic === 'object' && formData.profilePic.name) {
        data.append('profilePic', formData.profilePic);
      }

      // Only append resumeUrl if it's a File object (new upload)
      if (formData.resumeUrl && typeof formData.resumeUrl === 'object' && formData.resumeUrl.name) {
        data.append('resumeUrl', formData.resumeUrl);
      }

      const updatedUser = await updateUserProfile(data);

      // Handle response
      const userData = updatedUser?.user || updatedUser?.data || updatedUser;

      setUser(userData);
      dispatch(setUserData({ user: userData }));
      setIsEditing(false);
      setPreviewImage(null);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Error updating profile: " + (typeof err === 'string' ? err : err?.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setErrorMsg("");
  };

  if (loading)
    return (
      <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <NavBarApplicant />
        <div className="flex flex-1 items-center justify-center">
          <h3 className={`text-lg font-semibold animate-pulse ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Loading profile details...
          </h3>
        </div>
      </div>
    );

  if (errorMsg && !isEditing)
    return (
      <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <NavBarApplicant />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className={`p-8 rounded-lg shadow-md w-[90%] sm:w-[400px] ${isDarkMode
              ? 'bg-red-900/20 border border-red-800 text-red-300'
              : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
            <h2 className="text-lg font-semibold mb-3">
              {errorMsg}
            </h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              Please try again later or refresh the page.
            </p>
          </div>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <NavBarApplicant />
        <div className="flex flex-1 items-center justify-center">
          <div className={`p-8 rounded-xl shadow-md text-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'
            }`}>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-cyan-600'}`}>
              Profile not found.
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sign in to view your details.</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen flex flex-col relative ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <NavBarApplicant />
      <main className="flex-1 pt-24 py-10 px-5 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {/* Display Mode */}
          {!isEditing && (
            <div className={`rounded-xl shadow-lg px-8 py-10 mb-8 hover:shadow-xl transition ${isDarkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
              {/* Error Message */}
              {errorMsg && (
                <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${isDarkMode
                    ? 'bg-red-900/20 border border-red-800 text-red-300'
                    : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                  {errorMsg}
                </div>
              )}

              {/* Profile Header */}
              <div className="flex items-center gap-5 mb-8">
                <div className="relative">
                  {user.profilePic ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}${user.profilePic}`}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-cyan-100 shadow-md"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-cyan-100 shadow-md">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h1>
                  <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>@{user.userName}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Bio</h3>
                <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {user.bio || "No bio added yet."}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode
                            ? 'bg-cyan-900/50 text-cyan-300'
                            : 'bg-cyan-100 text-cyan-700'
                          }`}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-400'}>No skills listed yet.</span>
                  )}
                </div>
              </div>

              {/* Resume */}
              <div className={`mb-8 p-5 rounded-lg border ${isDarkMode
                  ? 'bg-cyan-900/20 border-cyan-800'
                  : 'bg-cyan-50 border-cyan-200'
                }`}>
                <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                  <File size={20} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                  Resume
                </h3>
                {user.resumeUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Resume uploaded</p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Click to download</p>
                    </div>
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/user/download-resume/${user.resumeUrl.split('/').pop()}`}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium flex items-center gap-2 transition"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                ) : (
                  <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>No resume uploaded yet.</p>
                )}
              </div>

              {/* Edit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleEditClick}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  <Camera size={18} /> Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
              <div className={`w-[90%] sm:w-[550px] p-8 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Profile</h2>
                  <button
                    onClick={handleCancel}
                    className={isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Error Message in Modal */}
                {errorMsg && (
                  <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${isDarkMode
                      ? 'bg-red-900/20 border border-red-800 text-red-300'
                      : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {errorMsg}
                  </div>
                )}

                {/* Profile Picture Upload */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-20 w-20 rounded-full object-cover border-2 border-cyan-400"
                        />
                      ) : (
                        <div className={`h-20 w-20 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                          }`}>
                          <Camera size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        <span className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition font-medium text-sm ${isDarkMode
                            ? 'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-900/70'
                            : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                          }`}>
                          {uploadingImage ? "Uploading..." : "Choose Image"}
                        </span>
                      </label>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Max 5MB ΓÇó JPG, PNG</p>
                    </div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="mb-4">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    placeholder="Full Name"
                  />
                </div>

                {/* Username Field */}
                <div className="mb-4">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Username
                  </label>
                  <input
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    placeholder="Username"
                  />
                </div>

                {/* Bio Field */}
                <div className="mb-4">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills Field */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Skills
                  </label>
                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    placeholder="Skills (comma separated)"
                  />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Separate with commas, e.g: React, Node.js, UI Design</p>
                </div>

                {/* Resume Upload */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Resume
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeChange}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        <span className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition font-medium text-sm ${isDarkMode
                            ? 'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-900/70'
                            : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                          }`}>
                          {formData.resumeUrl && typeof formData.resumeUrl === 'object' ? formData.resumeUrl.name : "Choose Resume"}
                        </span>
                      </label>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Max 10MB ΓÇó PDF, DOC, DOCX</p>
                    </div>
                    {user.resumeUrl && typeof formData.resumeUrl === 'string' && (
                      <p className="text-xs text-green-600 font-medium">Γ£ô Current resume uploaded</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={uploadingImage}
                    className={`px-6 py-2 rounded-lg border font-medium transition disabled:opacity-50 ${isDarkMode
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                        : 'border-slate-400 text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={uploadingImage}
                    className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition disabled:opacity-50"
                  >
                    {uploadingImage ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfileApplicant;
