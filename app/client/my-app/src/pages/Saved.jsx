import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSavedJobs, removeSavedJob } from "../apiCalls/authCalls";
import Navbar from "../components/NavBar";

const Saved = () => {
  const { userData } = useSelector((state) => state.user);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleRemove = async (jobId) => {
    try {
      const res = await removeSavedJob(jobId);
      alert(res.message || "Job removed from saved list.");
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      alert(err.message || "Unable to remove job.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <h3 className="text-white font-semibold text-lg animate-pulse">
            Loading your saved jobs...
          </h3>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500 text-center">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-[90%] sm:w-[400px]">
            <h2 className="text-red-500 text-lg font-semibold mb-3">
              {errorMsg}
            </h2>
            <p className="text-gray-600">Try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-emerald-600 text-xl font-semibold">
              Please sign in to view saved jobs.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500">
      <Navbar />

      <main className="flex-1 pt-24 py-10 px-5 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl px-8 py-10">
          <h1 className="text-4xl font-bold text-blue-700 mb-4 text-center">
            Saved Jobs
          </h1>
          <p className="text-gray-600 text-center mb-8">
            All the jobs you’ve saved to check out later.
          </p>

          {savedJobs.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              You haven’t saved any jobs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 mb-3">
                      {job.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skillsRequired?.length > 0 ? (
                        job.skillsRequired.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No skills listed.
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(job._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Saved;
