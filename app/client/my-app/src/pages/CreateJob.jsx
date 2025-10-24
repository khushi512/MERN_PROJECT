import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { createJob } from "../apiCalls/authCalls";
import { useNavigate } from "react-router-dom";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await createJob(jobPayload);
      navigate("/my-jobs");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-500">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 p-10 flex flex-col md:flex-row items-start md:items-start justify-between gap-10">
        {/* Left Side - Heading */}
        <section className="md:w-1/2 text-white">
          <h1 className="text-4xl font-bold mb-4">Create a New Job Post</h1>
          <p className="text-lg">
            Share your next project and connect with top design professionals.
          </p>
        </section>

        {/* Right Side - Form Card with Floating Effect */}
        <section className="md:w-1/2 w-full bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 mt-8 md:mt-0
                            transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Interior Designer for Modern Apartment"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the project, requirements, and expectations..."
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Skills Required
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                required
                placeholder="e.g., AutoCAD, 3D Rendering, Lighting Design"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple skills with commas.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white font-semibold py-3 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
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
