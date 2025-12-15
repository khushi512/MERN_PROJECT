import React, { useState } from "react";
import { updateJob } from "../apiCalls/authCalls";

export default function EditJobModal({ job, form, setForm, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!job || !form) return null;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Build payload but exclude empty strings and keep types correct
      const payload = {
        // send only fields that are defined (avoid sending empty string)
        ...(form.title !== undefined && form.title !== "" ? { title: form.title } : {}),
        ...(form.description !== undefined && form.description !== "" ? { description: form.description } : {}),
        ...(form.skillsRequired !== undefined
          ? {
              skillsRequired: form.skillsRequired
                .toString()
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }
          : {}),
        ...(form.employmentType ? { employmentType: form.employmentType } : {}),
        ...(form.location !== undefined && form.location !== "" ? { location: form.location } : {}),
        ...(form.salary !== undefined && form.salary !== "" ? { salary: form.salary } : {}),
        ...(form.experience !== undefined && form.experience !== "" ? { experience: form.experience } : {}),
        ...(form.education !== undefined && form.education !== "" ? { education: form.education } : {}),
      };

      // Call update once and use returned updated job
      const updated = await updateJob(job._id, payload);
      // depending on your authCalls implementation, updateJob may return data or response
      const updatedJob = updated?.data ?? updated;

      onSaved && onSaved(updatedJob);
      onClose && onClose();
    } catch (err) {
      console.error("EditJobModal save error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <input
          className="w-full border p-2 rounded mb-3"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Job Title"
        />

        <textarea
          className="w-full border p-2 rounded mb-3"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />

        <input
          className="w-full border p-2 rounded mb-3"
          value={form.skillsRequired}
          onChange={(e) =>
            setForm({ ...form, skillsRequired: e.target.value })
          }
          placeholder="Skills (comma separated)"
        />

        <select
          className="w-full border p-2 rounded mb-3"
          value={form.employmentType}
          onChange={(e) =>
            setForm({ ...form, employmentType: e.target.value })
          }
        >
          <option value="">(Optional) Select employment type</option>
          {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            )
          )}
        </select>

        <input
          className="w-full border p-2 rounded mb-3"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Location"
        />

        <input
          className="w-full border p-2 rounded mb-4"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
          placeholder="Salary"
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border border-gray-300"
            onClick={onClose}
            type="button"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded text-white bg-gradient-to-r from-[#48c6ef] to-[#6f86d6] disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
