import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSavedJobs, removeSavedJob, saveJob, applyToJob } from "../apiCalls/authCalls";
import { setUserData } from "../redux/userSlice";
import NavBarApplicant from "../components/NavBarApplicant";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  Bookmark,
  Briefcase,
  MapPin,
  DollarSign,
  Clock
} from "lucide-react";

const Saved = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const jobs = await getSavedJobs();
        setSavedJobs(jobs || []);
      } catch (error) {
        setErrorMsg(error.message || "Failed to load saved jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      await removeSavedJob(jobId);
      const newSavedJobs = savedJobs.filter((job) => job._id !== jobId);
      setSavedJobs(newSavedJobs);

      // Update Redux store
      const updatedUserData = {
        ...userData,
        savedJobs: newSavedJobs.map(j => j._id)
      };
      dispatch(setUserData({ user: updatedUserData }));

      // Reset to page 1 if current page has no items
      if (paginatedJobs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Failed to unsave job:", err);
      alert(err.message || "Unable to remove job.");
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      await applyToJob(jobId);
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Failed to apply:", err);
      alert(err.message || "Failed to apply for job.");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = savedJobs.slice(startIndex, startIndex + jobsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} flex flex-col`}>
        <NavBarApplicant />
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );

  if (errorMsg)
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} flex flex-col`}>
        <NavBarApplicant />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className={`rounded-xl p-6 text-center max-w-md ${isDarkMode
              ? 'bg-red-900/20 border border-red-800 text-red-300'
              : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
            <p className="font-semibold mb-1">Oops!</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      </div>
    );

  if (!userData)
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} flex flex-col`}>
        <NavBarApplicant />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className={`rounded-xl shadow-md p-8 text-center max-w-md ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'
            }`}>
            <p>Please sign in to view saved jobs.</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} flex flex-col`}>
      <NavBarApplicant />

      <main className="flex-1 pt-24 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
              Saved Jobs
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              All the jobs you've bookmarked for later
            </p>
          </div>

          {/* Empty State */}
          {savedJobs.length === 0 ? (
            <div className="text-center py-20">
              <div className={`inline-block p-4 rounded-full mb-4 ${isDarkMode ? 'bg-cyan-900/30' : 'bg-cyan-100'
                }`}>
                <Bookmark className="text-cyan-600" size={32} />
              </div>
              <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                No Saved Jobs Yet
              </h2>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                Start bookmarking jobs to save them for later!
              </p>
            </div>
          ) : (
            <>
              {/* Jobs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`
                      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
                      rounded-2xl p-6 flex flex-col relative
                      border shadow-sm hover:shadow-md
                      transition-all hover:-translate-y-1
                      h-full
                    `}
                  >
                    {/* Save/Unsave Button */}
                    <button
                      onClick={() => handleUnsaveJob(job._id)}
                      className="absolute top-4 right-4 p-2 rounded-lg transition bg-yellow-100 text-yellow-500"
                    >
                      <Bookmark
                        size={18}
                        className="fill-yellow-400 stroke-yellow-500"
                      />
                    </button>

                    {/* Title */}
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} line-clamp-2 min-h-[48px]`}>
                      {job.title}
                    </h3>

                    {/* Company */}
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mt-1 mb-3 flex items-center gap-1 min-h-[20px]`}>
                      <Briefcase size={14} />
                      {job.postedBy?.companyName || "Company"}
                    </p>

                    {/* Description */}
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} line-clamp-3 min-h-[72px] mb-4`}>
                      {job.description || "No description available."}
                    </p>

                    {/* Details (fixed height) */}
                    <div className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} min-h-[96px]`}>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {job.location || "Location"}
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        {job.salary || "Salary"}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {job.employmentType || "Job Type"}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-4 min-h-[32px]">
                      {job.skillsRequired?.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className={`
                            px-3 py-1 text-xs rounded-full
                            ${isDarkMode
                              ? 'bg-cyan-900/50 text-cyan-300'
                              : 'bg-cyan-100 text-cyan-700'
                            }
                          `}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Apply Button always at bottom */}
                    <button
                      onClick={() => handleApplyJob(job._id)}
                      className={`
                        mt-auto py-3 rounded-xl font-semibold text-white
                        ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-cyan-600 hover:opacity-90'}
                        transition
                      `}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-cyan-50 hover:border-cyan-400'
                      }`}
                  >
                    ΓåÉ Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                            ? "bg-cyan-600 text-white shadow-lg"
                            : isDarkMode
                              ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                              : "bg-white border border-slate-300 text-slate-700 hover:bg-cyan-50 hover:border-cyan-400"
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
                    Next ΓåÆ
                  </button>
                </div>
              )}

              {/* Results Summary */}
              <div className="mt-10 text-center">
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Showing <span className="font-bold text-cyan-600">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-cyan-600">
                    {Math.min(startIndex + jobsPerPage, savedJobs.length)}
                  </span>{" "}
                  of <span className="font-bold text-cyan-600">{savedJobs.length}</span> job
                  {savedJobs.length !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Saved;
