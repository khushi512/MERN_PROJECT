import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Eye,
  MousePointer,
  Plus,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import NavBarRecruiter from "../components/NavBarRecruiter";
import { getMyJobs } from "../apiCalls/authCalls";
import { ThemeContext } from "../contexts/ThemeContext";

export default function DashboardRecruiter() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  
  const [stats, setStats] = useState({ posted: 0, applicants: 0, views: 0, clicks: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getMyJobs({ page: 1, limit: 6 });
        const jobs = response?.jobs || [];

        const totalApplicants = jobs.reduce(
          (sum, j) => sum + (j.applicants?.length || 0),
          0
        );

        const totalViews = jobs.reduce(
          (sum, j) => sum + (j.views || 0),
          0
        );

        const totalClicks = jobs.reduce(
          (sum, j) => sum + (j.clicks || 0),
          0
        );

        const recentActs = [];

        jobs.forEach((job) => {
          job.applicants?.forEach((app) =>
            recentActs.push({
              title: job.title,
              user: app.user?.name ?? "Applicant",
              time: app.appliedAt,
            })
          );
        });

        setStats({
          posted: jobs.length,
          applicants: totalApplicants,
          views: totalViews,
          clicks: totalClicks,
        });

        setRecent(
          recentActs
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 6)
        );
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <NavBarRecruiter />

      <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? 'bg-blue-500/10' : 'bg-white/5'
          }`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? 'bg-cyan-500/10' : 'bg-blue-400/10'
          }`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? 'bg-indigo-500/10' : 'bg-teal-300/5'
          }`} style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 px-6 pt-24 pb-20">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full text-sm mb-6 border ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700 text-gray-300' 
                  : 'bg-white/10 border-white/20 text-white/90'
              }`}>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Your recruiting command center is live
              </div>
              
              <h1 className={`text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                Recruiting runs on Insights.
                <br />
                <span className={isDarkMode ? 'text-gray-400' : 'text-white/70'}>
                  DesignHire runs the rest.
                </span>
              </h1>
              
              <p className={`text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${
                isDarkMode ? 'text-gray-400' : 'text-white/80'
              }`}>
                Our specialized dashboard helps you monitor every posting, track every applicant, and
                catch every opportunity — so you can focus on hiring the best talent.
              </p>

              <button
                onClick={() => navigate("/create-job")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-2xl inline-flex items-center gap-2 group ${
                  isDarkMode 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-900/50' 
                    : 'bg-white text-cyan-600 hover:bg-white/90 shadow-black/20'
                }`}
              >
                Post New Job
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Top Row - Jobs Posted & Total Applicants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Jobs Posted Card */}
              <div
                onClick={() => navigate("/my-jobs")}
                className={`backdrop-blur-md p-8 rounded-2xl border hover:shadow-2xl transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700 hover:border-cyan-600' 
                    : 'bg-white/95 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <Briefcase className="text-cyan-600" size={28} />
                  <TrendingUp className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </div>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jobs Posted</p>
                <p className={`text-5xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {loading ? '...' : stats.posted}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Active postings</p>
              </div>

              {/* Total Applicants Card */}
              <div
                onClick={() => navigate("/all-applicants")}
                className={`backdrop-blur-md p-8 rounded-2xl border hover:shadow-2xl transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700 hover:border-cyan-600' 
                    : 'bg-white/95 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <Users className="text-cyan-600" size={28} />
                  <TrendingUp className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                </div>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Applicants</p>
                <p className={`text-5xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {loading ? '...' : stats.applicants}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Across all jobs</p>
              </div>

            </div>

            {/* Bottom Row - Views, Clicks & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Left Column - Views & Clicks */}
              <div className="space-y-6">
                
                {/* Total Views Card */}
                <div className={`backdrop-blur-md p-6 rounded-2xl border hover:shadow-2xl transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700 hover:border-cyan-600' 
                    : 'bg-white/95 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <Eye className="text-cyan-600" size={24} />
                    <TrendingUp className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                  </div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Views</p>
                  <p className={`text-4xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {loading ? '...' : stats.views.toLocaleString()}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Job impressions</p>
                </div>

                {/* Apply Clicks Card */}
                <div className={`backdrop-blur-md p-6 rounded-2xl border hover:shadow-2xl transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700 hover:border-cyan-600' 
                    : 'bg-white/95 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <MousePointer className="text-cyan-600" size={24} />
                    <TrendingUp className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                  </div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Apply Clicks</p>
                  <p className={`text-4xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {loading ? '...' : stats.clicks}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Application starts</p>
                </div>

              </div>

              {/* Right Column - Recent Activity */}
              <div className="lg:col-span-2">
                <div className={`backdrop-blur-md p-8 rounded-2xl border h-full ${
                  isDarkMode 
                    ? 'bg-gradient-to-b from-cyan-600/90 to-cyan-900/90 border-cyan-700/50' 
                    : 'bg-white/95 border-gray-200'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h2>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${
                        isDarkMode ? 'border-white' : 'border-cyan-600'
                      }`}></div>
                    </div>
                  ) : recent.length === 0 ? (
                    <div className="text-center py-12">
                      <p className={isDarkMode ? 'text-cyan-100' : 'text-gray-500'}>No recent activity.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recent.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-4 p-4 rounded-xl transition-all border ${
                            isDarkMode 
                              ? 'bg-white/10 hover:bg-white/15 border-white/20' 
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div className="mt-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isDarkMode ? 'bg-white/20' : 'bg-cyan-100'
                            }`}>
                              <Clock className={isDarkMode ? 'text-white' : 'text-cyan-600'} size={18} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.user} applied to <span className={isDarkMode ? 'text-cyan-200' : 'text-cyan-600'}>{item.title}</span>
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-cyan-100/70' : 'text-gray-500'}`}>
                              {new Date(item.time).toLocaleString()}
                            </p>
                          </div>
                          <button className={`transition-colors ${
                            isDarkMode ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-cyan-600'
                          }`}>
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h3 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                Ready to find your next star hire?
              </h3>
              <p className={`text-xl mb-8 max-w-2xl mx-auto ${
                isDarkMode ? 'text-gray-400' : 'text-white/80'
              }`}>
                Streamline your hiring process and connect with top design talent today.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate("/my-jobs")}
                  className={`px-8 py-4 backdrop-blur-sm rounded-xl font-semibold transition-all border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/30'
                  }`}
                >
                  View All Jobs
                </button>
                <button
                  onClick={() => navigate("/all-applicants")}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-xl ${
                    isDarkMode 
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                      : 'bg-white text-cyan-600 hover:bg-white/90'
                  }`}
                >
                  View Applicants
                </button>
              </div>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer className={`relative z-10 py-12 text-center border-t ${
          isDarkMode ? 'border-gray-800' : 'border-white/20'
        }`}>
          <div className="max-w-7xl mx-auto px-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-white/70'}`}>
              © 2024 DesignHire. Crafted for the design community.
            </p>
          </div>
        </footer>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${
            isDarkMode ? 'border-gray-700' : 'border-white/30'
          }`}>
            <div className={`w-1 h-3 rounded-full mt-2 ${
              isDarkMode ? 'bg-gray-600' : 'bg-white/50'
            }`}></div>
          </div>
        </div>
      </div>
    </>
  );
}