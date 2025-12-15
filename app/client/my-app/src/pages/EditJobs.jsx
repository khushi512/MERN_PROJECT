import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBarRecruiter from "../components/NavBarRecruiter";
import { getJobById, updateJob } from "../apiCalls/authCalls";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Remote",
];

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    employmentType: "",
    location: "",
    salary: "",
  });

  // Load job on mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
        setForm({
          title: data.title,
          description: data.description,
          skillsRequired: data.skillsRequired.join(", "),
          employmentType: data.employmentType || "",
          location: data.location || "",
          salary: data.salary || "",
        });
      } catch (err) {
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        employmentType: form.employmentType || undefined, // allow empty
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await updateJob(id, payload);

      navigate(`/job/${id}`);
    } catch (err) {
      setError("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <>
        <NavBarRecruiter />
        <div className="pt-32 text-center text-blue-600">Loading...</div>
      </>
    );

  return (
    <>
      <NavBarRecruiter />

      <main className="max-w-4xl mx-auto pt-28 px-4 pb-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Job</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          {error && (
            <p className="text-red-600 font-medium mb-3">{error}</p>
          )}

          {/* 2-column layout container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div className="col-span-1">
              <label className="font-medium text-gray-700">Title</label>
              <input
                className="w-full border p-2.5 rounded mt-1"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>

            {/* Location */}
            <div className="col-span-1">
              <label className="font-medium text-gray-700">Location</label>
              <input
                className="w-full border p-2.5 rounded mt-1"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>

            {/* Salary */}
            <div className="col-span-1">
              <label className="font-medium text-gray-700">Salary</label>
              <input
                className="w-full border p-2.5 rounded mt-1"
                value={form.salary}
                onChange={(e) =>
                  setForm({ ...form, salary: e.target.value })
                }
              />
            </div>

            {/* Employment Type */}
            <div className="col-span-1">
              <label className="font-medium text-gray-700">Employment Type</label>
              <select
                value={form.employmentType}
                onChange={(e) =>
                  setForm({ ...form, employmentType: e.target.value })
                }
                className="w-full border p-2.5 rounded mt-1"
              >
                <option value="">Optional — Select type…</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div className="col-span-1 md:col-span-2">
              <label className="font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <input
                className="w-full border p-2.5 rounded mt-1"
                value={form.skillsRequired}
                onChange={(e) =>
                  setForm({ ...form, skillsRequired: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="w-full border p-3 rounded mt-1"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] 
                       text-white px-6 py-3 rounded-lg font-semibold 
                       hover:opacity-90 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </>
  );
}
