import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { getAppliedJobs } from "../apiCalls/authCalls";

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getAppliedJobs(token);
        setJobs(data);
      } catch (err) {
        setError("Failed to load applied jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 pt-24">
        {/* pt-24 ensures content starts below the fixed navbar */}

        <h1 className="text-3xl font-bold text-teal-700 mb-4">
          Jobs You Applied To
        </h1>

        {loading && <p className="text-teal-700">Loading jobs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-700">You haven’t applied to any jobs yet.</p>
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
                  Applied on: {new Date(job.appliedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default AppliedJobs;
