import React, { useEffect, useState, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllJobs,
  applyToJob,
  saveJob,
  removeSavedJob,
  getRecommendedJobs,
  getSavedJobs,
} from "../apiCalls/authCalls";
import { setUserData } from "../redux/userSlice";
import NavBarApplicant from "../components/NavBarApplicant";
import {
  Search,
  Bookmark,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Clock,
  Moon,
  Sun,
} from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContext";

const Browse = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [skills, setSkills] = useState([]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const [allSkills, setAllSkills] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);

  /* ---------------- FETCH DATA ---------------- */

  const fetchSavedJobs = async () => {
    try {
      const jobs = await getSavedJobs();
      // Extract just the IDs for comparison
      const jobIds = jobs.map((j) => j._id);
      setSavedJobs(jobIds);
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
      setSavedJobs([]);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      setRecommendedLoading(true);
      const res = await getRecommendedJobs();
      setRecommendedJobs(res);
    } catch {
      setRecommendedJobs([]);
    } finally {
      setRecommendedLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobs({
        page,
        limit: 6,
        search,
        location,
        type,
        skills: skills.join(","),
      });

      setJobs(res.jobs);
      setTotalPages(res.pages);

      const skillSet = new Set();
      res.jobs.forEach((j) =>
        j.skillsRequired?.forEach((s) => skillSet.add(s))
      );
      setAllSkills([...skillSet]);
    } catch {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    if (userData?.skills?.length) fetchRecommendedJobs();
  }, [userData]);

  useEffect(() => {
    fetchJobs();
  }, [page, search, skills, location, type]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  /* ---------------- HANDLERS ---------------- */

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  const handleApplyJob = async (id) => {
    await applyToJob(id);
    fetchJobs();
    fetchRecommendedJobs();
  };

  const handleSaveJob = async (id) => {
    const saved = savedJobs.includes(id);
    try {
      if (saved) {
        await removeSavedJob(id);
        const newSavedJobs = savedJobs.filter((i) => i !== id);
        setSavedJobs(newSavedJobs);

        // Update Redux state to keep it in sync
        dispatch(setUserData({
          user: { ...userData, savedJobs: newSavedJobs }
        }));
      } else {
        await saveJob(id);
        const newSavedJobs = [...savedJobs, id];
        setSavedJobs(newSavedJobs);

        // Update Redux state to keep it in sync
        dispatch(setUserData({
          user: { ...userData, savedJobs: newSavedJobs }
        }));
      }
    } catch (err) {
      console.error("Failed to save/unsave job:", err);
      // Revert optimistic update if API call fails
      fetchSavedJobs();
    }
  };

  /* ---------------- JOB CARD ---------------- */

  const JobCard = ({ job }) => {
    const isSaved = savedJobs.includes(job._id);

    return (
      <div
        className={`
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
          rounded-2xl p-6 flex flex-col relative
          border shadow-sm hover:shadow-md
          transition-all hover:-translate-y-1
          h-full
        `}
      >
        {/* Save Button */}
        <button
          onClick={() => handleSaveJob(job._id)}
          className={`
            absolute top-4 right-4 p-2 rounded-lg transition
            ${isSaved
              ? "bg-yellow-100 text-yellow-500"
              : isDarkMode
                ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }
          `}
        >
          <Bookmark
            size={18}
            className={isSaved ? "fill-yellow-400 stroke-yellow-500" : ""}
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
          {job.description}
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
    );
  };


  /* ---------------- RENDER ---------------- */

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <NavBarApplicant />

      <main className="max-w-7xl mx-auto pt-24 px-6 pb-16">
        {/* SEARCH + FILTERS */}
        <div className={`
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
          border rounded-2xl p-6 mb-12 shadow-sm
        `}>
          <div className="relative mb-4">
            <Search className={`absolute left-3 top-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className={`
                w-full pl-10 pr-4 py-2 border rounded-lg
                ${isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
                }
              `}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className={`
                border rounded-lg px-4 py-2
                ${isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
                }
              `}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`
                border rounded-lg px-4 py-2
                ${isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
                }
              `}
            >
              <option value="">All Job Types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>

            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`
                  w-full border rounded-lg px-4 py-2 text-left
                  ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                  }
                `}
              >
                {skills.length
                  ? `${skills.length} skills selected`
                  : "Filter by skills"}
              </button>

              {dropdownOpen && (
                <div className={`
                  absolute border rounded-lg mt-2 w-full shadow-lg max-h-48 overflow-auto z-20
                  ${isDarkMode
                    ? 'bg-slate-700 border-slate-600'
                    : 'bg-white border-slate-200'
                  }
                `}>
                  {allSkills.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`
                        block w-full text-left px-4 py-2
                        ${isDarkMode
                          ? 'text-white hover:bg-slate-600'
                          : 'text-slate-900 hover:bg-slate-100'
                        }
                      `}
                    >
                      {skills.includes(s) ? "Γ£ô " : ""}
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECOMMENDED */}
        {userData?.skills?.length > 0 && (
          <section className="mb-16">
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Recommended For You
            </h2>

            {recommendedLoading ? (
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Loading...</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ALL JOBS */}
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Browse Jobs</h2>

        {loading ? (
          <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
