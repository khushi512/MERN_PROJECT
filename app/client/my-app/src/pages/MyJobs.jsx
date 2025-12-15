import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { getMyJobs } from "../apiCalls/authCalls";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // adjust if stored elsewhere
        const data = await getMyJobs(token);
        setJobs(data);
      } catch (err) {
        setError("Failed to load your jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto pt-24 p-6">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">My Jobs</h1>

        {loading && <p className="text-teal-700">Loading your jobs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-700">You haven’t posted any jobs yet.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="p-4 card hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500 text-sm">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default MyJobs;
