import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Filter,
    Eye,
    Pencil,
    Trash2,
    X,
    Download,
    File,
    Check,
    XCircle,
    AlertCircle,
    MapPin,
    DollarSign,
    Briefcase,
    GraduationCap,
} from "lucide-react";
import NavBarRecruiter from "../components/NavBarRecruiter";
import EditJobModal from "../components/EditJobModal";
import { getJobById, updateApplicationStatus, deleteJob } from "../apiCalls/authCalls";
import { ThemeContext } from "../contexts/ThemeContext";

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useContext(ThemeContext);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [updatingApplicantId, setUpdatingApplicantId] = useState(null);
    const [actionModal, setActionModal] = useState(null);
    const [deleteJobModal, setDeleteJobModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Helper function to get image URL
    const getImageUrl = (profilePic) => {
        if (!profilePic) return null;
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
        return `${baseUrl}${profilePic}`;
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(id);
                setJob(data);
                setEditForm({
                    title: data.title,
                    description: data.description,
                    skillsRequired: data.skillsRequired.join(", "),
                    employmentType: data.employmentType || "",
                    location: data.location || "",
                    salary: data.salary || "",
                });
            } catch (err) {
                console.error("Error loading job:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleAcceptReject = async (applicantId, status) => {
        try {
            setUpdatingApplicantId(applicantId);
            await updateApplicationStatus(id, applicantId, status);

            // Update local state
            setJob(prevJob => ({
                ...prevJob,
                applicants: prevJob.applicants.map(app =>
                    app.user?._id === applicantId
                        ? { ...app, status }
                        : app
                )
            }));

            setActionModal(null);
        } catch (err) {
            console.error("Error updating application:", err);
            alert("Failed to update application status");
        } finally {
            setUpdatingApplicantId(null);
        }
    };

    const handleDeleteJob = async () => {
        try {
            setIsDeleting(true);
            await deleteJob(id);
            alert("Job deleted successfully");
            navigate("/my-jobs");
        } catch (err) {
            console.error("Error deleting job:", err);
            alert("Failed to delete job");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <NavBarRecruiter />
                <div className={`pt-40 text-center text-lg animate-pulse ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Loading job details...
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <NavBarRecruiter />
                <div className={`pt-40 text-center text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Job not found.
                </div>
            </div>
        );
    }

    // FILTER APPLICANTS
    const applicants = job.applicants?.map((a) => ({
        name: a.user?.name || "Unknown",
        email: a.user?.email || "",
        userName: a.user?.userName || "",
        bio: a.user?.bio || "",
        profilePic: a.user?.profilePic || "",
        appliedAt: a.appliedAt,
        skills: a.user?.skills || [],
        resumeUrl: a.user?.resumeUrl || "",
        id: a.user?._id || "",
        status: a.status || "pending",
    })) || [];

    const filtered = applicants
        .filter((a) =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            sortBy === "recent"
                ? new Date(b.appliedAt) - new Date(a.appliedAt)
                : a.name.localeCompare(b.name)
        );

    const getStatusBadge = (status) => {
        if (isDarkMode) {
            const darkStyles = {
                pending: "bg-yellow-900/40 text-yellow-300 border border-yellow-800",
                accepted: "bg-green-900/40 text-green-300 border border-green-800",
                rejected: "bg-red-900/40 text-red-300 border border-red-800",
            };
            return darkStyles[status] || darkStyles.pending;
        } else {
            const lightStyles = {
                pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
                accepted: "bg-green-100 text-green-800 border border-green-300",
                rejected: "bg-red-100 text-red-800 border border-red-300",
            };
            return lightStyles[status] || lightStyles.pending;
        }
    };

    return (
        <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <NavBarRecruiter />

            {/* FIXED SPACING */}
            <div className="pt-24"></div>

            {/* TOP HEADER SECTION */}
            <div className={`py-8 shadow-md transition-colors ${isDarkMode
                    ? 'bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600'
                }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        {/* LEFT SIDE */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <button
                                onClick={() => navigate(-1)}
                                className="hover:bg-white/20 p-2 rounded-lg transition text-white flex-shrink-0 mt-1"
                            >
                                <ArrowLeft size={24} />
                            </button>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                                <p className="text-white/80 text-sm mb-4">
                                    Posted by {job.postedBy?.name} • {new Date(job.postedAt).toLocaleDateString()}
                                </p>

                                {/* Job Meta Info */}
                                <div className="flex flex-wrap gap-2 text-sm text-white/90">
                                    {job.location && (
                                        <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                                            <MapPin size={14} />
                                            <span>{job.location}</span>
                                        </div>
                                    )}
                                    {job.salary && (
                                        <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                                            <DollarSign size={14} />
                                            <span>{job.salary}</span>
                                        </div>
                                    )}
                                    {job.employmentType && (
                                        <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                                            <Briefcase size={14} />
                                            <span>{job.employmentType}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* APPLICANT COUNT BOX */}
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold text-white shadow-lg">
                            <div className="text-2xl text-center">{applicants.length}</div>
                            <div className="text-xs opacity-90">Applicants</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">

                    {/* LEFT SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div className={`rounded-xl shadow-lg p-6 sticky top-28 transition-colors ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                            }`}>

                            {/* DESCRIPTION */}
                            <h3 className={`text-sm font-semibold uppercase mb-3 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                                }`}>
                                Description
                            </h3>
                            <p className={`text-sm mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                {job.description}
                            </p>

                            {/* SKILLS */}
                            <h3 className={`text-sm font-semibold uppercase mb-3 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                                }`}>
                                Skills Required
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {job.skillsRequired?.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode
                                                ? 'bg-blue-900/40 text-blue-300'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Additional Info */}
                            {(job.experience || job.education) && (
                                <>
                                    <div className={`h-px my-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

                                    <div className="space-y-3 mb-6">
                                        {job.experience && (
                                            <div className="flex items-start gap-2">
                                                <Briefcase size={16} className={isDarkMode ? 'text-gray-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                                                <div>
                                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Experience</p>
                                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        {job.experience}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {job.education && (
                                            <div className="flex items-start gap-2">
                                                <GraduationCap size={16} className={isDarkMode ? 'text-gray-400 mt-0.5' : 'text-gray-500 mt-0.5'} />
                                                <div>
                                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Education</p>
                                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        {job.education}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className={`h-px my-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

                            {/* ACTION BUTTONS */}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 mb-3 transition ${isDarkMode
                                        ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-800'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                                    }`}
                            >
                                <Pencil size={16} /> Edit Job
                            </button>

                            <button
                                onClick={() => setDeleteJobModal(true)}
                                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${isDarkMode
                                        ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60 border border-red-800'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                    }`}
                            >
                                <Trash2 size={16} /> Delete Job
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SIDE - APPLICANTS LIST */}
                    <div className={`lg:col-span-3 rounded-xl shadow-lg overflow-hidden transition-colors ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                        }`}>

                        {/* SEARCH + FILTER BAR */}
                        <div className={`p-6 border-b transition-colors ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* SEARCH */}
                                <div className="flex-1 relative">
                                    <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                    <input
                                        type="text"
                                        placeholder="Search applicants..."
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* FILTER */}
                                <div className="flex items-center gap-2">
                                    <Filter size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className={`border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        <option value="recent">Most Recent</option>
                                        <option value="name">Name A–Z</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* APPLICANTS LIST */}
                        {filtered.length === 0 ? (
                            <div className={`p-16 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <p className="text-lg">No applicants found</p>
                            </div>
                        ) : (
                            <div className={isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
                                {filtered.map((a, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-6 transition ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start gap-6">
                                            {/* LEFT INFO */}
                                            <div className="flex items-start gap-4 flex-1">
                                                {/* Avatar */}
                                                {a.profilePic ? (
                                                    <img
                                                        src={getImageUrl(a.profilePic)}
                                                        alt={a.name}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                                                    />
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${isDarkMode
                                                            ? 'bg-gradient-to-br from-cyan-600 to-blue-700'
                                                            : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                                                        }`}>
                                                        {a.name?.charAt(0)}
                                                    </div>
                                                )}

                                                {/* Info */}
                                                <div className="flex-1">
                                                    <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {a.name}
                                                    </h4>
                                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        {a.email}
                                                    </p>

                                                    {a.skills.length > 0 && (
                                                        <div className="flex gap-2 mt-2 flex-wrap">
                                                            {a.skills.slice(0, 3).map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`text-xs px-2 py-1 rounded ${isDarkMode
                                                                            ? 'bg-gray-700 text-gray-300'
                                                                            : 'bg-gray-100 text-gray-700'
                                                                        }`}
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {a.skills.length > 3 && (
                                                                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                                                    }`}>
                                                                    +{a.skills.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RIGHT SECTION */}
                                            <div className="text-right">
                                                <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                                    }`}>
                                                    Applied {new Date(a.appliedAt).toLocaleDateString()}
                                                </p>

                                                {/* STATUS BADGE */}
                                                <div className="flex justify-end mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadge(a.status)}`}>
                                                        {a.status}
                                                    </span>
                                                </div>

                                                {/* ACTION BUTTONS */}
                                                <div className="flex gap-2 justify-end flex-wrap">
                                                    <button
                                                        onClick={() => setSelectedApplicant(a)}
                                                        className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition font-medium ${isDarkMode
                                                                ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60'
                                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                            }`}
                                                    >
                                                        <Eye size={16} /> View
                                                    </button>

                                                    {a.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => setActionModal({ applicantId: a.id, action: "accepted" })}
                                                                disabled={updatingApplicantId === a.id}
                                                                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition font-medium disabled:opacity-50 ${isDarkMode
                                                                        ? 'bg-green-900/40 text-green-300 hover:bg-green-900/60'
                                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                                    }`}
                                                            >
                                                                <Check size={16} /> Accept
                                                            </button>

                                                            <button
                                                                onClick={() => setActionModal({ applicantId: a.id, action: "rejected" })}
                                                                disabled={updatingApplicantId === a.id}
                                                                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition font-medium disabled:opacity-50 ${isDarkMode
                                                                        ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
                                                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                    }`}
                                                            >
                                                                <XCircle size={16} /> Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* APPLICANT PROFILE MODAL */}
            {selectedApplicant && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    onClick={() => setSelectedApplicant(null)}
                >
                    <div
                        className={`rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedApplicant(null)}
                            className={`absolute top-4 right-4 transition ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <X size={24} />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pr-8">
                            {selectedApplicant.profilePic ? (
                                <img
                                    src={getImageUrl(selectedApplicant.profilePic)}
                                    alt={selectedApplicant.name}
                                    className="w-20 h-20 rounded-full object-cover border-3 border-cyan-500 shadow-lg"
                                />
                            ) : (
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ${isDarkMode
                                        ? 'bg-gradient-to-br from-cyan-600 to-blue-700'
                                        : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                                    }`}>
                                    {selectedApplicant.name?.charAt(0)}
                                </div>
                            )}

                            <div>
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedApplicant.name}
                                </h2>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>@{selectedApplicant.userName}</p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{selectedApplicant.email}</p>
                            </div>
                        </div>

                        {/* Bio */}
                        {selectedApplicant.bio && (
                            <div className="mb-6">
                                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Bio</h3>
                                <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedApplicant.bio}</p>
                            </div>
                        )}

                        {/* Skills */}
                        <div className="mb-6">
                            <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedApplicant.skills?.length > 0 ? (
                                    selectedApplicant.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800'}`}
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No skills listed.</p>
                                )}
                            </div>
                        </div>

                        {/* Resume Section */}
                        {selectedApplicant.resumeUrl ? (
                            <div className={`p-5 rounded-lg border mb-6 ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}`}>
                                <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <File size={20} className="text-green-600" />
                                    Resume
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Resume Uploaded</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Click to download</p>
                                    </div>
                                    <a
                                        href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/user/download-resume/${selectedApplicant.resumeUrl.split('/').pop()}`}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <Download size={16} />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className={`p-5 rounded-lg border mb-6 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <p className={isDarkMode ? 'text-gray-400 text-center' : 'text-gray-600 text-center'}>No resume uploaded</p>
                            </div>
                        )}

                        {/* Status Badge in Modal */}
                        <div className={`mb-4 p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Application Status</p>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedApplicant.status)}`}>
                                {selectedApplicant.status}
                            </span>
                        </div>

                        {/* Applied Date */}
                        <p className={`text-xs pt-4 border-t ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                            Applied on: {new Date(selectedApplicant.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            )}

            {/* CONFIRMATION MODAL FOR ACCEPT/REJECT */}
            {actionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {actionModal.action === "accepted" ? "Accept Applicant?" : "Reject Applicant?"}
                        </h3>
                        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {actionModal.action === "accepted"
                                ? "This applicant will be marked as accepted. You can change this later."
                                : "This applicant will be marked as rejected. You can change this later."}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setActionModal(null)}
                                disabled={updatingApplicantId !== null}
                                className={`flex-1 py-2.5 rounded-lg font-medium transition disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAcceptReject(actionModal.applicantId, actionModal.action)}
                                disabled={updatingApplicantId !== null}
                                className={`flex-1 py-2.5 rounded-lg text-white font-medium transition disabled:opacity-50 ${actionModal.action === "accepted"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {updatingApplicantId === actionModal.applicantId ? "Processing..." : actionModal.action === "accepted" ? "Accept" : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE JOB CONFIRMATION MODAL */}
            {deleteJobModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                <AlertCircle size={24} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
                            </div>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Delete Job?
                            </h3>
                        </div>

                        <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Are you sure you want to delete <span className="font-semibold">"{job.title}"</span>?
                        </p>

                        <p className={`mb-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            This action cannot be undone. All applicant data for this job will be lost.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteJobModal(false)}
                                disabled={isDeleting}
                                className={`flex-1 py-2.5 rounded-lg font-medium transition disabled:opacity-50 ${isDarkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteJob}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT JOB MODAL */}
            {showEditModal && (
                <EditJobModal
                    job={job}
                    form={editForm}
                    setForm={setEditForm}
                    onClose={() => setShowEditModal(false)}
                    onSaved={(updatedJob) => {
                        setJob({
                            ...updatedJob,
                            applicants: job.applicants
                        });
                        setShowEditModal(false);
                    }}
                />
            )}

        </div>
    );
}