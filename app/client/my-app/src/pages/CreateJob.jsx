import React, { useState, useContext } from "react";
import NavBarRecruiter from "../components/NavBarRecruiter";
import { createJob } from "../apiCalls/authCalls";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";

const EMPLOYMENT_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Remote",
];

function CreateJob() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    employmentType: "",
    location: "",
    salary: "",
    experience: "",
    education: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const jobPayload = {
        title: formData.title,
        description: formData.description,
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        employmentType: formData.employmentType,
        location: formData.location,
        salary: formData.salary,
        experience: formData.experience,
        education: formData.education,
      };

      await createJob(jobPayload);
      navigate("/my-jobs");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-600"
      }`}
    >
      <NavBarRecruiter />

      <main className="max-w-7xl mx-auto pt-24 p-10 flex flex-col md:flex-row gap-10">
        {/* LEFT PANEL */}
        <section className="md:w-1/2 md:sticky md:top-60 h-fit">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Create a New Job Post
          </h1>
          <p className="text-lg text-white/80">
            Share opportunities and connect with top design talent.
          </p>

          <div className="mt-8 text-sm text-white/80 space-y-3">
            <p>
              <strong>Note:</strong> Employment type is a single selection.
            </p>
          </div>
        </section>

        {/* FORM CARD */}
        <section
          className={`md:w-1/2 w-full rounded-3xl p-8 border backdrop-blur-md
            transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
            ${
              isDarkMode
                ? "bg-slate-800/90 border-slate-700"
                : "bg-white/95 border-gray-200"
            }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Job Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Interior Designer"
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white focus:ring-cyan-500"
                    : "bg-white border-gray-300 focus:ring-cyan-400"
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Responsibilities, expectations, tools..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white focus:ring-cyan-500"
                    : "bg-white border-gray-300 focus:ring-cyan-400"
                }`}
              />
            </div>

            {/* Skills */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Skills Required
              </label>
              <input
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                required
                placeholder="AutoCAD, SketchUp, V-Ray..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white focus:ring-cyan-500"
                    : "bg-white border-gray-300 focus:ring-cyan-400"
                }`}
              />
              <p
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Separate skills with commas.
              </p>
            </div>

            {/* Employment Type */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white focus:ring-cyan-500"
                    : "bg-white border-gray-300 focus:ring-cyan-400"
                }`}
              >
                <option value="">Select employment type</option>
                {EMPLOYMENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, Remote"
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            {/* Salary */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Salary (optional)
              </label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Γé╣40,000 - Γé╣60,000 / month"
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            {/* Experience */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Experience
              </label>
              <input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="2+ years, Senior, Fresher..."
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            {/* Education */}
            <div>
              <label
                className={`block font-medium mb-2 ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Education
              </label>
              <input
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="B.Arch, Diploma in Interior Design..."
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isDarkMode
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:opacity-90"
              } disabled:opacity-50`}
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreateJob;
