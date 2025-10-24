import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FilePlus2, Bookmark } from "lucide-react";
import Navbar from "../components/NavBar";
import { getMyJobs, getAppliedJobs, getSavedJobs } from "../apiCalls/authCalls";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posted: 0, applied: 0, saved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postedJobs, appliedJobs, savedJobs] = await Promise.all([
          getMyJobs(),
          getAppliedJobs(),
          getSavedJobs(),
        ]);
        setStats({
          posted: postedJobs?.length || 0,
          applied: appliedJobs?.length || 0,
          saved: savedJobs?.length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />
      {/* Add padding-top to prevent navbar overlap */}
      <main className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600 text-lg">
              Welcome back! Here's your overview.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-teal-700 animate-pulse text-lg">
              Loading dashboard...
            </p>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {/* My Jobs Card */}
                <div
                  onClick={() => navigate("/my-jobs")}
                  className="card p-6 flex flex-col cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-transform"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      My Jobs
                    </h3>
                    <Briefcase className="text-teal-600" />
                  </div>
                  <p className="text-slate-500 mb-2">Jobs you've posted</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.posted}
                  </p>
                </div>

                {/* Applications Card */}
                <div
                  onClick={() => navigate("/applied-jobs")}
                  className="card p-6 flex flex-col cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-transform"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Applications
                    </h3>
                    <FilePlus2 className="text-teal-600" />
                  </div>
                  <p className="text-slate-500 mb-2">Jobs you've applied to</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.applied}
                  </p>
                </div>

                {/* Saved Jobs Card */}
                <div
                  onClick={() => navigate("/saved")}
                  className="card p-6 flex flex-col cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-transform"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Saved Jobs
                    </h3>
                    <Bookmark className="text-teal-600" />
                  </div>
                  <p className="text-slate-500 mb-2">
                    Jobs you saved for later
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.saved}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    Quick Actions
                  </h2>
                  <p className="text-slate-500 mb-4">
                    What would you like to do today?
                  </p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate("/create-job")} className="btn-primary">
                      ➕ Post a New Job
                    </button>
                    <button onClick={() => navigate("/explore")} className="btn-outline">
                      🔍 Browse Available Jobs
                    </button>
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    Recent Activity
                  </h2>
                  <p className="text-slate-500">
                    Your latest actions. Check your applications and posted jobs for updates.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Home;
