import User from '../models/user.model.js';
import Job from '../models/job.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// For ES6 modules, get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProfile = async (req, res) => {
  const userId = req.user.id;
  if (userId == undefined) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const verifiedUser = await User.findById(userId)
      .select('-password')
      .populate('appliedJobs postedJobs savedJobs');
    res.status(200).json(verifiedUser);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  console.log("=== UPDATE PROFILE START ===");
  console.log("Has files:", !!req.files);
  console.log("Body keys:", Object.keys(req.body));

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const commonFields = ["name", "userName", "bio"];
    const applicantFields = ["skills"];
    const recruiterFields = ["companyName", "companyWebsite", "companyLocation"];

    let allowedUpdates = [...commonFields];

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userType === "applicant") {
      allowedUpdates.push(...applicantFields);
    } else if (user.userType === "recruiter") {
      allowedUpdates.push(...recruiterFields);
    }

    // Prepare update object
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        // Special handling for skills array
        if (key === 'skills' && typeof req.body[key] === 'string') {
          console.log("Skills before split:", req.body[key]);
          updates[key] = req.body[key].split(',').map(s => s.trim()).filter(Boolean);
          console.log("Skills after split:", updates[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    console.log("Updates object keys:", Object.keys(updates));

    // Handle profile picture upload (Cloudinary URL)
    if (req.files?.profilePic) {
      console.log("ProfilePic: uploading to Cloudinary");
      updates.profilePic = req.files.profilePic[0].path; // Cloudinary URL
      console.log("ProfilePic URL received");
    }

    // Handle resume upload (only for applicants) - Cloudinary URL
    if (req.files?.resumeUrl && user.userType === "applicant") {
      console.log("Resume: uploading to Cloudinary");
      updates.resumeUrl = req.files.resumeUrl[0].path; // Cloudinary URL
      console.log("Resume URL received");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    console.log("Update successful");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("=== ERROR IN UPDATE PROFILE ===");
    console.error("Error:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: err.message || "Error updating profile" });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const { filename } = req.params;

    // Security: prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ message: "Invalid filename" });
    }

    const filepath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    // Set headers to force download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error("File stream error:", err);
      res.status(500).json({ message: "Error downloading file" });
    });
  } catch (err) {
    console.error("Download resume error:", err);
    res.status(500).json({ message: "Error downloading resume" });
  }
};

// SAVE A JOB => POST /api/user/save/:jobId
export const saveJob = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: "Job saved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error saving job" });
  }
};

// REMOVE A SAVED JOB => DELETE /api/user/save/:jobId
export const removeSavedJob = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Job removed from saved" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error removing saved job" });
  }
};

// GET ALL SAVED JOBS => GET /api/user/saved
export const getSavedJobs = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('savedJobs');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.savedJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching saved jobs" });
  }
};

// GET USER BY ID (for public profile) => GET /api/user/:id
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "name userName email bio skills profilePic resumeUrl userType"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// GET APPLIED JOBS FOR APPLICANT => GET /api/user/applied
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Get all jobs where this user is in applicants array
    const appliedJobs = await Job.find({
      "applicants.user": userId
    })
      .populate("postedBy", "name companyName")
      .sort({ postedAt: -1 });

    if (!appliedJobs || appliedJobs.length === 0) {
      return res.status(200).json([]);
    }

    // Map jobs to include application status and details
    const jobsWithStatus = appliedJobs.map(job => {
      const applicant = job.applicants.find(app => {
        if (!app.user) return false;
        const appUserId = typeof app.user === 'string' ? app.user : app.user.toString();
        return appUserId === userId;
      });

      return {
        _id: job._id,
        title: job.title,
        description: job.description,
        skillsRequired: job.skillsRequired || [],
        employmentType: job.employmentType,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        education: job.education,
        postedBy: job.postedBy,
        applicationStatus: applicant ? applicant.status : "pending",
        appliedAt: applicant ? applicant.appliedAt : new Date(),
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      };
    });

    return res.status(200).json(jobsWithStatus);
  } catch (err) {
    console.error("Get Applied Jobs Error:", err);
    res.status(500).json({
      message: "Error fetching applied jobs",
      error: err.message
    });
  }
};


