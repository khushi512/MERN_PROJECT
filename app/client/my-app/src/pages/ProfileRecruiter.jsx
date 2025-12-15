import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, updateUserProfile } from "../apiCalls/authCalls";
import { setUserData } from "../redux/userSlice";
import NavBarRecruiter from "../components/NavBarRecruiter";
import { ThemeContext } from "../contexts/ThemeContext";
import { Camera, X, Building2, Globe, MapPin, Sun, Moon } from "lucide-react";

function ProfileRecruiter() {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState("");
    const [user, setUser] = useState(userData || null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        userName: "",
        bio: "",
        companyName: "",
        companyWebsite: "",
        companyLocation: "",
        profilePic: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const u = await getCurrentUser();
                setUser(u);
                setFormData({
                    name: u.name || "",
                    userName: u.userName || "",
                    bio: u.bio || "",
                    companyName: u.companyName || "",
                    companyWebsite: u.companyWebsite || "",
                    companyLocation: u.companyLocation || "",
                    profilePic: u.profilePic || "",
                });
            } catch (err) {
                console.error("Failed to load profile:", err);
                setErrorMsg("Failed to load profile details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInput = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

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

    const handleEditClick = () => {
        setIsEditing(true);
        if (user?.profilePic) {
            setPreviewImage(`http://localhost:8001${user.profilePic}`);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSave = async () => {
        try {
            setUploadingImage(true);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('userName', formData.userName);
            data.append('bio', formData.bio);
            data.append('companyName', formData.companyName);
            data.append('companyWebsite', formData.companyWebsite);
            data.append('companyLocation', formData.companyLocation);
            
            if (formData.profilePic instanceof File) {
                data.append('profilePic', formData.profilePic);
            }
            
            const updated = await updateUserProfile(data);
            const userData = updated?.user || updated?.data || updated;
            
            setUser(userData);
            dispatch(setUserData({ user: userData }));
            setIsEditing(false);
            setPreviewImage(null);
            setErrorMsg("");
        } catch (err) {
            console.error("Profile update error:", err);
            setErrorMsg(typeof err === 'string' ? err : err?.message || "Error updating profile");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPreviewImage(null);
        setErrorMsg("");
    };

    if (loading) {
        return (
            <>
                <NavBarRecruiter />
                <div className={`min-h-screen flex items-center justify-center font-semibold ${
                    isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-600"
                }`}>
                    Loading profile...
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <NavBarRecruiter />
                <div className={`min-h-screen flex items-center justify-center ${
                    isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-600"
                }`}>
                    Profile not found.
                </div>
            </>
        );
    }

    return (
        <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <NavBarRecruiter />

            {/* Theme Toggle Button */}
            <button
                onClick={toggleDarkMode}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-40 transition-all hover:scale-110 ${
                    isDarkMode 
                        ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" 
                        : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <div className="pt-20 px-4 pb-12 flex justify-center">
                <div className="w-full max-w-3xl">
                    
                    {/* Error Message */}
                    {errorMsg && !isEditing && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {errorMsg}
                        </div>
                    )}

                    {/* Minimal Header Section */}
                    <div className={`rounded-2xl shadow-lg overflow-hidden ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}>
                        {/* Subtle Top Accent Bar */}
                        <div className={`h-1 ${
                            isDarkMode 
                                ? "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600" 
                                : "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                        }`}></div>

                        {/* Profile Header */}
                        <div className="px-8 pt-8 pb-6">
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {user.profilePic ? (
                                        <img
                                            src={`http://localhost:8001${user.profilePic}`}
                                            alt={user.name}
                                            className={`h-24 w-24 rounded-full object-cover border-2 shadow-lg ${
                                                isDarkMode ? "border-gray-700" : "border-gray-200"
                                            }`}
                                        />
                                    ) : (
                                        <div className={`h-24 w-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 shadow-lg ${
                                            isDarkMode 
                                                ? "bg-gradient-to-br from-cyan-600 to-blue-700 border-gray-700" 
                                                : "bg-gradient-to-br from-cyan-500 to-blue-600 border-gray-200"
                                        }`}>
                                            {user.name?.charAt(0)?.toUpperCase() || "R"}
                                        </div>
                                    )}
                                </div>

                                {/* Name and Info */}
                                <div className="flex-1 min-w-0 pt-1">
                                    <h1 className={`text-3xl font-bold mb-1 ${
                                        isDarkMode ? "text-white" : "text-gray-900"
                                    }`}>
                                        {user.name}
                                    </h1>
                                    <div className={`flex flex-wrap items-center gap-2 text-base ${
                                        isDarkMode ? "text-gray-400" : "text-gray-600"
                                    }`}>
                                        <span>@{user.userName}</span>
                                        <span className={isDarkMode ? "text-gray-700" : "text-gray-400"}>•</span>
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={`h-px mx-8 mb-8 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>

                        {/* About Section */}
                        <div className="px-8 mb-6">
                            <div className={`rounded-xl p-6 border ${
                                isDarkMode 
                                    ? "bg-gray-900/50 border-gray-700" 
                                    : "bg-gray-50 border-gray-200"
                            }`}>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                                    isDarkMode ? "text-cyan-400" : "text-cyan-600"
                                }`}>
                                    📝 About
                                </h3>
                                <p className={`leading-relaxed ${
                                    isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                    {user.bio || "No bio added yet."}
                                </p>
                            </div>
                        </div>

                        {/* Company Details Section */}
                        <div className="px-8 mb-6">
                            <div className={`rounded-xl p-6 border ${
                                isDarkMode 
                                    ? "bg-gray-900/50 border-gray-700" 
                                    : "bg-gray-50 border-gray-200"
                            }`}>
                                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                                    isDarkMode ? "text-cyan-400" : "text-cyan-600"
                                }`}>
                                    🏢 Company Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Building2 size={20} className={isDarkMode ? "text-gray-400 mt-0.5" : "text-gray-500 mt-0.5"} />
                                        <div>
                                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Company Name</p>
                                            <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                                                {user.companyName || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Globe size={20} className={isDarkMode ? "text-gray-400 mt-0.5" : "text-gray-500 mt-0.5"} />
                                        <div>
                                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Website</p>
                                            <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                                                {user.companyWebsite || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={20} className={isDarkMode ? "text-gray-400 mt-0.5" : "text-gray-500 mt-0.5"} />
                                        <div>
                                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location</p>
                                            <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                                                {user.companyLocation || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <div className="flex justify-center px-8 pb-8">
                            <button
                                onClick={handleEditClick}
                                className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                                    isDarkMode
                                        ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                        : "bg-cyan-500 hover:bg-cyan-600 text-white"
                                }`}
                            >
                                <Camera size={20} /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    {isEditing && (
                        <div className="fixed inset-0 flex items-start justify-center bg-black/50 backdrop-blur-sm z-50 overflow-y-auto p-4">
                            <div className={`w-full max-w-xl rounded-2xl shadow-2xl my-8 ${
                                isDarkMode ? "bg-gray-800" : "bg-white"
                            }`}>
                                {/* Modal Header - Sticky */}
                                <div className={`sticky top-0 z-10 flex justify-between items-center p-6 border-b rounded-t-2xl ${
                                    isDarkMode 
                                        ? "bg-gray-800 border-gray-700" 
                                        : "bg-white border-gray-200"
                                }`}>
                                    <h2 className={`text-2xl font-semibold ${
                                        isDarkMode ? "text-white" : "text-gray-900"
                                    }`}>
                                        Edit Profile
                                    </h2>
                                    <button
                                        onClick={handleCancel}
                                        className={`hover:bg-gray-100 rounded-full p-2 transition ${
                                            isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-500"
                                        }`}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Scrollable Form Content */}
                                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                                    <div className="p-6">
                                        {/* Error Message in Modal */}
                                        {errorMsg && (
                                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                                {errorMsg}
                                            </div>
                                        )}

                                        {/* Profile Picture Upload */}
                                        <div className="mb-6">
                                            <label className={`block text-sm font-semibold mb-3 ${
                                                isDarkMode ? "text-gray-200" : "text-gray-900"
                                            }`}>
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
                                                        <div className={`h-20 w-20 rounded-full flex items-center justify-center ${
                                                            isDarkMode 
                                                                ? "bg-gray-700 text-gray-400" 
                                                                : "bg-gray-200 text-gray-600"
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
                                                        <span className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition font-medium text-sm ${
                                                            isDarkMode
                                                                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                                                : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100"
                                                        }`}>
                                                            {uploadingImage ? "Uploading..." : "Choose Image"}
                                                        </span>
                                                    </label>
                                                    <p className={`text-xs mt-1 ${
                                                        isDarkMode ? "text-gray-500" : "text-gray-500"
                                                    }`}>
                                                        Max 5MB • JPG, PNG
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="flex flex-col gap-4 pb-6">
                                            <div>
                                                <label className={`block text-sm font-semibold mb-2 ${
                                                    isDarkMode ? "text-gray-200" : "text-gray-900"
                                                }`}>
                                                    Full Name
                                                </label>
                                                <input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInput}
                                                    placeholder="Full Name"
                                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                                        isDarkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                                                            : "bg-white border-gray-300 text-gray-900"
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-semibold mb-2 ${
                                                    isDarkMode ? "text-gray-200" : "text-gray-900"
                                                }`}>
                                                    Username
                                                </label>
                                                <input
                                                    name="userName"
                                                    value={formData.userName}
                                                    onChange={handleInput}
                                                    placeholder="Username"
                                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                                        isDarkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                                                            : "bg-white border-gray-300 text-gray-900"
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-semibold mb-2 ${
                                                    isDarkMode ? "text-gray-200" : "text-gray-900"
                                                }`}>
                                                    Bio
                                                </label>
                                                <textarea
                                                    name="bio"
                                                    value={formData.bio}
                                                    onChange={handleInput}
                                                    placeholder="Tell us about yourself..."
                                                    rows="3"
                                                    className={`w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                                        isDarkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                                                            : "bg-white border-gray-300 text-gray-900"
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-semibold mb-2 ${
                                                    isDarkMode ? "text-gray-200" : "text-gray-900"
                                                }`}>
                                                    Company Name
                                                </label>
                                                <input
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleInput}
                                                    placeholder="Company Name"
                                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                                        isDarkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                                                            : "bg-white border-gray-300 text-gray-900"
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-semibold mb-2 ${
                                                    isDarkMode ? "text-gray-200" : "text-gray-900"
                                                }`}>
                                                    Company Website
                                                </label>
                                                <input
                                                    name="companyWebsite"
                                                    value={formData.companyWebsite}
                                                    onChange={handleInput}
                                                    placeholder="https://company.com"
                                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                                        isDarkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                                                            : "bg-white border-gray-300 text-gray-900"
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-semibold mb-2 ${
                                                    isDarkMode ? "text-gray-200" : "text-gray-900"
                                                }`}>
                                                    Company Location
                                                </label>
                                                <input
                                                    name="companyLocation"
                                                    value={formData.companyLocation}
                                                    onChange={handleInput}
                                                    placeholder="City, Country"
                                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                                        isDarkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                                                            : "bg-white border-gray-300 text-gray-900"
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons - Sticky */}
                                <div className={`sticky bottom-0 flex justify-end gap-3 p-6 border-t shadow-lg ${
                                    isDarkMode 
                                        ? "bg-gray-800 border-gray-700" 
                                        : "bg-white border-gray-200"
                                }`}>
                                    <button
                                        onClick={handleCancel}
                                        disabled={uploadingImage}
                                        className={`px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                                            isDarkMode
                                                ? "border border-gray-600 text-gray-300 hover:bg-gray-700"
                                                : "border border-gray-400 text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={uploadingImage}
                                        className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition disabled:opacity-50"
                                    >
                                        {uploadingImage ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileRecruiter;