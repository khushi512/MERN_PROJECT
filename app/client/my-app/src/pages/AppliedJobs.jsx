import React, { useEffect, useState, useContext } from "react";
import NavBarApplicant from "../components/NavBarApplicant";
import { getAppliedJobs, withdrawApplication } from "../apiCalls/authCalls";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  Briefcase,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  ArrowRight,
  X,
  Trash2
} from "lucide-react";

function AppliedJobs() {
  const { isDarkMode } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAppliedJobs();
        console.log("Applied jobs data:", data);
        setJobs(data);
        setError("");
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load applied jobs.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs by status
  const filteredJobs = selectedStatus === "all"
    ? jobs
    : jobs.filter(job => job.applicationStatus === selectedStatus);

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleWithdrawClick = (job) => {
    setSelectedJob(job);
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = async () => {
    if (!selectedJob) return;

    try {
      setIsWithdrawing(true);
      await withdrawApplication(selectedJob._id);

      // Remove from local state
      setJobs(jobs.filter(job => job._id !== selectedJob._id));

      setShowWithdrawModal(false);
      setSelectedJob(null);

      // Reset to first page if current page is empty
      if (startIndex >= filteredJobs.length - 1) {
        setCurrentPage(Math.max(1, currentPage - 1));
      }
    } catch (err) {
      console.error("Failed to withdraw application:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to withdraw application. Please try again.";
      alert(errorMessage);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: isDarkMode
        ? 'bg-yellow-900 text-yellow-300 border-yellow-700'
        : 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: isDarkMode
        ? 'bg-green-900 text-green-300 border-green-700'
        : 'bg-green-100 text-green-700 border-green-200',
      rejected: isDarkMode
        ? 'bg-red-900 text-red-300 border-red-700'
        : 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || styles.pending;
  };

  const statusTabs = [
    { label: 'All', value: 'all', count: jobs.length },
    { label: 'Pending', value: 'pending', count: jobs.filter(j => j.applicationStatus === 'pending').length },
    { label: 'Accepted', value: 'accepted', count: jobs.filter(j => j.applicationStatus === 'accepted').length },
    { label: 'Rejected', value: 'rejected', count: jobs.filter(j => j.applicationStatus === 'rejected').length },
  ];

  return (
    <>
      <NavBarApplicant />
      <main className={`min-h-screen pt-24 pb-12 transition-colors ${isDarkMode
        ? 'bg-slate-900'
        : 'bg-slate-50'
        }`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode
              ? 'text-white'
              : 'text-slate-900'
              }`}>
              Your Applications
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Track and manage all your job applications in one place
            </p>
          </div>

          {/* Filter Tabs */}
          {!loading && !error && jobs.length > 0 && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setSelectedStatus(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${selectedStatus === tab.value
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                    }`}
                >
                  {tab.label} {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${selectedStatus === tab.value
                      ? 'bg-cyan-700 text-white'
                      : isDarkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-200 text-slate-600'
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className={`rounded-xl p-6 text-center ${isDarkMode
              ? 'bg-red-900/20 border border-red-800 text-red-300'
              : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
              <p className="font-semibold mb-1">Oops!</p>
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-20">
              <div className={`inline-block p-4 rounded-full mb-4 ${isDarkMode ? 'bg-cyan-900/30' : 'bg-cyan-100'
                }`}>
                <Briefcase className="text-cyan-600" size={32} />
              </div>
              <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                No Applications Yet
              </h2>
              <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Start exploring jobs and apply to positions that match your skills!
              </p>
            </div>
          )}

          {/* No Results for Filter */}
          {!loading && !error && jobs.length > 0 && filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                No {selectedStatus} applications found.
              </p>
            </div>
          )}

          {/* Jobs Grid - 3 columns */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => (
                <div
                  key={job._id}
                  className={`rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${isDarkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-100'
                    }`}
                >
                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header with Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold mb-1 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                          {job.title}
                        </h3>
                        <p className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          <Building2 size={16} />
                          {job.postedBy?.name || job.postedBy?.companyName || "Company not specified"}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border whitespace-nowrap ml-2 ${getStatusBadge(job.applicationStatus || 'pending')
                        }`}>
                        {job.applicationStatus || 'pending'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-sm line-clamp-2 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {job.description}
                    </p>

                    {/* Job Details */}
                    <div className={`text-sm space-y-2 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {job.location && (
                        <p className="flex items-center gap-2">
                          <MapPin size={16} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                          {job.location}
                        </p>
                      )}
                      {job.salary && (
                        <p className="flex items-center gap-2">
                          <DollarSign size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                          {job.salary}
                        </p>
                      )}
                      {job.employmentType && (
                        <p className="flex items-center gap-2">
                          <Briefcase size={16} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                          {job.employmentType}
                        </p>
                      )}
                      {job.appliedAt && (
                        <p className="flex items-center gap-2">
                          <Calendar size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-600'} />
                          Applied: {new Date(job.appliedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>

                    {/* Skills */}
                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="mb-4 min-h-[32px]">
                        <div className="flex flex-wrap gap-2">
                          {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode
                                ? 'bg-cyan-900/50 text-cyan-300'
                                : 'bg-cyan-100 text-cyan-700'
                                }`}
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skillsRequired.length > 3 && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode
                              ? 'bg-gray-700 text-gray-400'
                              : 'bg-gray-100 text-gray-500'
                              }`}>
                              +{job.skillsRequired.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button - Fixed height placeholder */}
                    <div className="mt-auto min-h-[42px]">
                      {(job.applicationStatus === 'pending' || !job.applicationStatus) && (
                        <button
                          onClick={() => handleWithdrawClick(job)}
                          className={`w-full py-2.5 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${isDarkMode
                            ? 'bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                            }`}
                        >
                          <Trash2 size={16} />
                          Withdraw Application
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && filteredJobs.length > jobsPerPage && (
            <div className="mt-10 flex justify-center items-center gap-3">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode
                  ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-cyan-50 hover:border-cyan-400'
                  }`}
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : isDarkMode
                        ? "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode
                  ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-cyan-50 hover:border-cyan-400'
                  }`}
              >
                Next →
              </button>
            </div>
          )}

          {/* Results Summary */}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="mt-10 text-center">
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                Showing <span className="font-bold text-cyan-600">{startIndex + 1}</span> to{' '}
                <span className="font-bold text-cyan-600">
                  {Math.min(startIndex + jobsPerPage, filteredJobs.length)}
                </span>{' '}
                of <span className="font-bold text-cyan-600">{filteredJobs.length}</span>{' '}
                application{filteredJobs.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Withdraw Application
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                disabled={isWithdrawing}
                className={`p-1 rounded-lg transition-colors disabled:opacity-50 ${isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
                  }`}
              >
                <X size={20} />
              </button>
            </div>

            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to withdraw your application for{' '}
              <span className="font-semibold">{selectedJob.title}</span> at{' '}
              <span className="font-semibold">{selectedJob.postedBy?.name || selectedJob.postedBy?.companyName || 'this company'}</span>?
            </p>

            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This action cannot be undone. You will need to reapply if you change your mind.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                disabled={isWithdrawing}
                className={`flex-1 py-2.5 rounded-lg transition-colors font-medium disabled:opacity-50 ${isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmWithdraw}
                disabled={isWithdrawing}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-lg transition-colors font-medium"
              >
                {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppliedJobs;