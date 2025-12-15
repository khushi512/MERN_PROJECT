import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Eye, AlertCircle, X, MapPin, DollarSign, Briefcase, GraduationCap, Users } from "lucide-react";
import NavBarRecruiter from "../components/NavBarRecruiter";
import { getMyJobs, deleteJob, updateJob } from "../apiCalls/authCalls";
import { ThemeContext } from "../contexts/ThemeContext";

function MyJobs() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [editModal, setEditModal] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    employmentType: "",
    location: "",
    salary: "",
    experience: "",
    education: "",
  });

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await getMyJobs({ page, limit: 6 });

      console.log("Full Response:", response);
      console.log("Response.jobs:", response.jobs);
      console.log("Response.pages:", response.pages);
      console.log("Response.total:", response.total);

      setJobs(response.jobs || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError("Failed to load your jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [page]);

  const handleDeleteJob = async (jobId) => {
    try {
      setIsDeleting(true);
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      setDeleteModal(null);
      alert("Job deleted successfully");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (job) => {
    setEditModal(job);
    setEditForm({
      title: job.title || "",
      description: job.description || "",
      skillsRequired: Array.isArray(job.skillsRequired)
        ? job.skillsRequired.join(", ")
        : job.skillsRequired || "",
      employmentType: job.employmentType || "",
      location: job.location || "",
      salary: job.salary || "",
      experience: job.experience || "",
      education: job.education || "",
    });
  };

  // Handle Edit Form Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.skillsRequired.trim()) {
      alert("Title, Description, and Skills are required!");
      return;
    }

    try {
      setIsUpdating(true);

      const updateData = {
        ...editForm,
        skillsRequired: editForm.skillsRequired
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
      };

      await updateJob(editModal._id, updateData);

      // Update local state
      setJobs(jobs.map(job =>
        job._id === editModal._id
          ? { ...job, ...updateData }
          : job
      ));

      setEditModal(null);
      alert("Job updated successfully!");
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job");
    } finally {
      setIsUpdating(false);
    }
  };

  const goToPage = (pageNum) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // PAGINATION UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-10 h-10 rounded-lg font-semibold transition-all ${page === i
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
            : isDarkMode
              ? "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-3 mt-10 mb-12 select-none">
        {/* First Page */}
        <button
          onClick={() => goToPage(1)}
          disabled={page === 1}
          className={`text-xl font-bold transition ${page === 1
            ? "text-gray-300 cursor-not-allowed"
            : isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-600"
            }`}
        >
          ┬½
        </button>

        {/* Prev */}
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className={`text-xl font-bold transition ${page === 1
            ? "text-gray-300 cursor-not-allowed"
            : isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-600"
            }`}
        >
          ΓÇ╣
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">{pages}</div>

        {/* Next */}
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className={`text-xl font-bold transition ${page === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-600"
            }`}
        >
          ΓÇ║
        </button>

        {/* Last Page */}
        <button
          onClick={() => goToPage(totalPages)}
          disabled={page === totalPages}
          className={`text-xl font-bold transition ${page === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : isDarkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-600 hover:text-blue-600"
            }`}
        >
          ┬╗
        </button>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <NavBarRecruiter />

      <main className="max-w-7xl mx-auto pt-24 px-6 pb-12">

        {/* Heading */}
        <h1 className={`text-4xl font-extrabold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          My Jobs
        </h1>

        {loading && <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading your jobs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-700'}>You haven't posted any jobs yet.</p>
        )}

        {/* JOB CARDS */}
        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

              {jobs.map((job) => (
                <div
                  key={job._id}
                  className={`
                    rounded-2xl border p-6 shadow-sm 
                    hover:shadow-xl hover:-translate-y-1
                    transition-all duration-200 flex flex-col h-full
                    ${isDarkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {/* TITLE + APPLICANTS */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className={`text-xl font-bold line-clamp-2 flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {job.title}
                    </h2>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2
                        ${isDarkMode
                          ? 'bg-blue-900/40 text-blue-300'
                          : 'bg-gradient-to-r from-[#48c6ef]/20 to-[#6f86d6]/20 text-gray-700'
                        }
                      `}
                    >
                      {job.applicants?.length || 0} Applicants
                    </span>
                  </div>

                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Posted ΓÇó {new Date(job.postedAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
                    {job.employmentType && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${isDarkMode
                        ? 'bg-blue-900/40 text-blue-300'
                        : 'bg-blue-50 text-blue-600'
                        }`}>
                        {job.employmentType}
                      </span>
                    )}
                    {job.location && (
                      <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin size={12} /> {job.location}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm line-clamp-2 mb-4 flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs ${isDarkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {skill}
                      </span>
                    ))}

                    {job.skillsRequired.length > 3 && (
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        +{job.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className={`text-xs space-y-1 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {job.salary && <p className="flex items-center gap-1"><DollarSign size={12} /> <span className="font-medium">{job.salary}</span></p>}
                    {job.experience && <p className="flex items-center gap-1"><Briefcase size={12} /> Experience: <span className="font-medium">{job.experience}</span></p>}
                    {job.education && <p className="flex items-center gap-1"><GraduationCap size={12} /> Education: <span className="font-medium">{job.education}</span></p>}
                  </div>

                  {/* Stats */}
                  <div className={`text-xs mb-4 py-2 px-2 rounded-lg flex items-center gap-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                    <span className="flex items-center gap-1"><Eye size={12} /> {job.views || 0} views</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {job.applicants?.length || 0} applies</span>
                  </div>

                  {/* Action Buttons - Fixed at bottom */}
                  <div className={`flex gap-2 border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/job/${job._id}`);
                      }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition ${isDarkMode
                        ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                    >
                      <Eye size={16} /> View
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(job);
                      }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition ${isDarkMode
                        ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal(job);
                      }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition ${isDarkMode
                        ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}

            </div>

            {/* PAGINATION */}
            {renderPagination()}
          </>
        )}

      </main>

      {/* Edit Job Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl my-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Header */}
            <div className={`flex justify-between items-center p-6 border-b sticky top-0 rounded-t-2xl z-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Edit Job
              </h2>
              <button
                onClick={() => setEditModal(null)}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
              >
                <X size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>

            {/* Form */}
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Describe the role, responsibilities, and requirements..."
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Skills Required * <span className="text-xs text-gray-500">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    name="skillsRequired"
                    value={editForm.skillsRequired}
                    onChange={handleEditChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="e.g., React, TypeScript, Node.js"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={editForm.employmentType}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  >
                    <option value="">Select employment type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                {/* Location & Salary - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      placeholder="e.g., Remote, New York, etc."
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Salary
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={editForm.salary}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      placeholder="e.g., $80k - $120k"
                    />
                  </div>
                </div>

                {/* Experience & Education - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={editForm.experience}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      placeholder="e.g., 3-5 years"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={editForm.education}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      placeholder="e.g., Bachelor's Degree"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Buttons - Outside the scrollable area */}
            <div className={`flex gap-3 p-6 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
              <button
                type="button"
                onClick={() => setEditModal(null)}
                disabled={isUpdating}
                className={`flex-1 py-3 rounded-lg font-semibold transition disabled:opacity-50 ${isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleEditSubmit}
                disabled={isUpdating}
                className="flex-1 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
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
              Are you sure you want to delete <span className="font-semibold">"{deleteModal.title}"</span>?
            </p>

            <p className={`mb-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This action cannot be undone. All applicant data for this job will be lost.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={isDeleting}
                className={`flex-1 py-2.5 rounded-lg font-medium transition disabled:opacity-50 ${isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteModal._id)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyJobs;
