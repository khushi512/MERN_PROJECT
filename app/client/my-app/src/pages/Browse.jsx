import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllJobs, applyToJob, saveJob } from "../apiCalls/authCalls";
import Navbar from "../components/NavBar";

const Browse = () => {
  const { userData } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApplyJob = async (jobId) => {
    try {
      const res = await applyToJob(jobId);
      alert(res?.message || "Job application submitted!");
    } catch (err) {
      alert(err?.message || err || "Failed to apply for job.");
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const res = await saveJob(jobId);
      alert(res?.message || "Job saved successfully!");
    } catch (err) {
      alert(err?.message || err || "Failed to save job.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen brand-gradient-bg">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <h2 className="text-lg font-semibold text-white animate-pulse">
            Loading available jobs...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen brand-gradient-bg">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="card p-6 text-center text-red-500 font-semibold">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col brand-gradient-bg">
      <Navbar />

      <main className="flex-1 py-24 px-5 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
            Explore Stunning Design Projects
          </h1>

          {jobs.length === 0 ? (
            <p className="text-center text-white text-lg">
              No jobs found. Check back later.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map(
                (job) =>
                  job && (
                    <div
                      key={job._id || Math.random()}
                      className="card p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-teal-700 mb-2">
                          {job.title || "Untitled Job"}
                        </h2>
                        <p className="text-slate-600 mb-3">
                          {job.description || "No description provided."}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(job.skillsRequired || []).map((skill, idx) => (
                            <span key={idx} className="badge">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between mt-3">
                        <button onClick={() => handleApplyJob(job._id)} className="btn-primary">
                          Apply
                        </button>
                        <button onClick={() => handleSaveJob(job._id)} className="btn-outline">
                          Save
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
