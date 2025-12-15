import React, { useEffect, useState, useContext } from "react";
import NavBarRecruiter from "../components/NavBarRecruiter";
import { getAllApplicantsList, getMyJobs } from "../apiCalls/authCalls";
import { Download, File, X } from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContext";
import { getImageUrl } from "../utils/imageUtils";

function AllApplicants() {
    const { isDarkMode } = useContext(ThemeContext);

    const [allApplicants, setAllApplicants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedJob, setSelectedJob] = useState("all");
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    // Pagination
    const [page, setPage] = useState(1);
    const perPage = 6;



    useEffect(() => {
        const loadData = async () => {
            const applicants = await getAllApplicantsList();
            const recruiterJobs = await getMyJobs();

            setJobs(recruiterJobs.jobs || []);
            setAllApplicants(applicants);
            setFiltered(applicants);
        };

        loadData();
    }, []);

    // Filter logic
    const applyFilter = () => {
        let list = allApplicants;

        if (selectedJob !== "all") {
            list = list.filter((a) => a.jobId === selectedJob);
        }

        if (search.trim()) {
            list = list.filter(
                (a) =>
                    a.user.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.user.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFiltered(list);
        setPage(1);
    };

    useEffect(() => {
        applyFilter();
    }, [search, selectedJob]);

    // Pagination slicing
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    return (
        <>
            <NavBarRecruiter />

            <main className={`min-h-screen pt-24 px-6 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                <div className="max-w-6xl mx-auto">
                    <h1 className={`text-4xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        All Applicants
                    </h1>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className={`border p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition ${isDarkMode
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className={`border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 transition ${isDarkMode
                                    ? 'bg-gray-800 border-grey-700 text-white placeholder-gray-400'
                                    : 'bg-white border-grey-300 text-gray-900'
                                }`}
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                        >
                            <option value="all">All Jobs</option>
                            {jobs.map((job) => (
                                <option key={job._id} value={job._id}>
                                    {job.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Results count */}
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Showing <b>{filtered.length}</b> applicants
                    </p>

                    {/* Applicant List */}
                    {paginated.length === 0 ? (
                        <p className={`text-center py-20 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            No applicants found.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paginated.map((app, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedApplicant(app)}
                                    className={`border rounded-xl shadow-sm p-5 hover:shadow-lg transition-all cursor-pointer ${isDarkMode
                                            ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                                            : 'bg-white border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        {/* Profile Picture or Avatar */}
                                        {app.user.profilePic ? (
                                            <img
                                                src={getImageUrl(app.user.profilePic)}
                                                alt={app.user.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                                {app.user.name.charAt(0)}
                                            </div>
                                        )}

                                        <div>
                                            <h2 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {app.user.name}
                                            </h2>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                {app.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Applied for: <b className={
                                            isDarkMode
                                                ? 'text-cyan-400 font-semibold'
                                                : 'text-cyan-600 font-semibold'
                                        }>{app.jobTitle}</b>
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {app.user.skills?.slice(0, 3).map((skill) => (
                                            <span
                                                key={skill}
                                                className={`px-2 py-1 rounded-full text-xs ${isDarkMode
                                                        ? 'bg-gray-700 text-gray-300'
                                                        : 'bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                        Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3 mt-8 mb-12">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className={`px-4 py-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode
                                        ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                ΓåÉ Previous
                            </button>

                            <span className={`px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Page {page} of {totalPages}
                            </span>

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className={`px-4 py-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode
                                        ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Next ΓåÆ
                            </button>
                        </div>
                    )}
                </div>

                {/* APPLICANT PROFILE MODAL */}
                {selectedApplicant && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                        onClick={() => setSelectedApplicant(null)}
                    >
                        <div
                            className={`rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedApplicant(null)}
                                className={`absolute top-4 right-4 transition ${isDarkMode
                                        ? 'text-gray-400 hover:text-gray-200'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <X size={24} />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6 pr-8">
                                {/* Profile Picture or Avatar */}
                                {selectedApplicant.user.profilePic ? (
                                    <img
                                        src={getImageUrl(selectedApplicant.user.profilePic)}
                                        alt={selectedApplicant.user.name}
                                        className="w-20 h-20 rounded-full object-cover border-3 border-blue-200 shadow-md"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                                        {selectedApplicant.user.name?.charAt(0)}
                                    </div>
                                )}

                                <div>
                                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {selectedApplicant.user.name}
                                    </h2>
                                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        @{selectedApplicant.user.userName}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {selectedApplicant.user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            {selectedApplicant.user.bio && (
                                <div className="mb-6">
                                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Bio
                                    </h3>
                                    <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        {selectedApplicant.user.bio}
                                    </p>
                                </div>
                            )}

                            {/* Job Applied */}
                            <div className={`mb-6 p-4 rounded-lg border ${isDarkMode
                                    ? 'bg-blue-900/20 border-blue-800'
                                    : 'bg-blue-50 border-blue-200'
                                }`}>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <span className="font-semibold">Applied for:</span>{' '}
                                    <span className={`font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                                        }`}>
                                        {selectedApplicant.jobTitle}
                                    </span>
                                </p>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                    Applied on: {new Date(selectedApplicant.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="mb-6">
                                <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApplicant.user.skills?.length > 0 ? (
                                        selectedApplicant.user.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${isDarkMode
                                                        ? 'bg-blue-900/30 text-blue-300 border border-blue-800'
                                                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800'
                                                    }`}
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            No skills listed.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Resume Section */}
                            {selectedApplicant.user.resumeUrl ? (
                                <div className={`p-5 rounded-lg border ${isDarkMode
                                        ? 'bg-green-900/20 border-green-800'
                                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                    }`}>
                                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        <File size={20} className="text-green-600" />
                                        Resume
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                                }`}>
                                                Resume Uploaded
                                            </p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Click to download
                                            </p>
                                        </div>
                                        <a
                                            href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/api/user/download-resume/${selectedApplicant.user.resumeUrl.split('/').pop()}`}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <Download size={16} />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className={`p-5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                    <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        No resume uploaded
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </main>
        </>
    );
}

export default AllApplicants;
