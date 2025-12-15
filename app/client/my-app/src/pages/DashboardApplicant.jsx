import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarApplicant from "../components/NavBarApplicant";
import { Briefcase, Bookmark, ArrowRight, Search, Zap } from "lucide-react";
import { ThemeContext } from "../contexts/ThemeContext";
import { getSavedJobs, getAppliedJobs } from "../apiCalls/authCalls";

export default function HomeApplicant() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [stats, setStats] = useState({
    applications: 0,
    saved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [savedJobsData, appliedJobsData] = await Promise.all([
          getSavedJobs(),
          getAppliedJobs()
        ]);

        setStats({
          applications: appliedJobsData?.length || 0,
          saved: savedJobsData?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({
          applications: 0,
          saved: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <NavBarApplicant />

      <main
        className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50"
          }`}
      >
        <div className="max-w-6xl mx-auto px-6">

          {/* HEADER */}
          <div className="mb-12">
            <h1
              className={`text-5xl font-bold mb-3 ${isDarkMode
                ? "text-white"
                : "bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent"
                }`}
            >
              Welcome Back!
            </h1>
            <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
              Continue your journey in design. Explore opportunities and advance your career.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

            {/* Applications */}
            <div
              onClick={() => navigate("/applied-jobs")}
              className={`group cursor-pointer rounded-2xl border backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl ${isDarkMode
                ? "bg-slate-800/80 border-slate-700"
                : "bg-white/95 border-gray-200"
                }`}
            >
              <div className="h-2 bg-gradient-to-r from-cyan-500 to-sky-500" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-4 rounded-xl ${isDarkMode ? "bg-cyan-500/20" : "bg-cyan-100"
                      }`}
                  >
                    <Briefcase
                      className={isDarkMode ? "text-cyan-400" : "text-cyan-600"}
                      size={28}
                    />
                  </div>
                  <ArrowRight
                    className={`transition transform group-hover:translate-x-1 ${isDarkMode ? "text-slate-500" : "text-gray-400"
                      }`}
                    size={24}
                  />
                </div>

                <h2
                  className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {stats.applications}
                </h2>
                <p className={isDarkMode ? "text-slate-300" : "text-gray-600"}>
                  Jobs Applied
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  View your applications and track status
                </p>
              </div>
            </div>

            {/* Saved Jobs */}
            <div
              onClick={() => navigate("/saved")}
              className={`group cursor-pointer rounded-2xl border backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl ${isDarkMode
                ? "bg-slate-800/80 border-slate-700"
                : "bg-white/95 border-gray-200"
                }`}
            >
              <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-4 rounded-xl ${isDarkMode ? "bg-amber-500/20" : "bg-amber-100"
                      }`}
                  >
                    <Bookmark
                      className={isDarkMode ? "text-amber-400" : "text-amber-600"}
                      size={28}
                    />
                  </div>
                  <ArrowRight
                    className={`transition transform group-hover:translate-x-1 ${isDarkMode ? "text-slate-500" : "text-gray-400"
                      }`}
                    size={24}
                  />
                </div>

                <h2
                  className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {stats.saved}
                </h2>
                <p className={isDarkMode ? "text-slate-300" : "text-gray-600"}>
                  Saved Opportunities
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  Jobs you've bookmarked for later
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className={`rounded-2xl shadow-xl overflow-hidden ${isDarkMode
              ? "bg-gradient-to-r from-slate-800 to-slate-700"
              : "bg-gradient-to-r from-cyan-500 to-sky-600"
              }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="text-amber-300" size={24} />
                  <h3 className="text-white/80 font-semibold">
                    Ready to explore?
                  </h3>
                </div>

                <h2 className="text-3xl font-bold text-white mb-3">
                  Discover New Design Opportunities
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Browse through curated design positions tailored to your skills and experience.
                </p>

                <button
                  onClick={() => navigate("/explore")}
                  className="px-6 py-3 bg-white text-cyan-600 rounded-lg font-semibold hover:bg-white/90 transition flex items-center gap-2 group"
                >
                  <Search size={18} />
                  Browse Jobs
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </button>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <div className="w-40 h-40 bg-white/5 rounded-3xl flex items-center justify-center">
                  <Briefcase className="text-white/20" size={80} />
                </div>
              </div>
            </div>
          </div>

          {/* TIPS */}
          <div className="mt-12">
            <h3
              className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Career Tips
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Optimize Your Profile",
                  description:
                    "Add a professional photo, compelling bio, and list all your key skills",
                  icon: "👤",
                },
                {
                  title: "Keep Your Resume Updated",
                  description:
                    "Upload a current resume that highlights your best work and achievements",
                  icon: "📄",
                },
                {
                  title: "Apply Early",
                  description:
                    "Apply to jobs early to increase your chances of being noticed by recruiters",
                  icon: "⚡",
                },
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-6 border transition hover:shadow-lg ${isDarkMode
                    ? "bg-slate-800/80 border-slate-700"
                    : "bg-white/95 border-gray-200"
                    }`}
                >
                  <div className="text-4xl mb-4">{tip.icon}</div>
                  <h4
                    className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {tip.title}
                  </h4>
                  <p className={isDarkMode ? "text-slate-400 text-sm" : "text-gray-600 text-sm"}>
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
