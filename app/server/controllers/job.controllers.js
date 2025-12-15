import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

//CREATE JOB => POST /api/job
export const createJob = async (req, res) => {
  const { title,
    description,
    skillsRequired,
    employmentType,
    location,
    salary,
    experience,
    education, } = req.body;
  if (!title || !description || !skillsRequired) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }
  try {
    const newJob = await Job.create({
      title,
      description,
      skillsRequired,
      employmentType,
      location,
      salary,
      experience,
      education,
      postedBy: req.user.id,
    });
    const user = await User.findById(req.user.id);
    user.postedJobs.push(newJob._id);
    await user.save();
    res.status(201).json(newJob);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error creating job" });
  }
};

// GET ALL JOBS => GET /api/job
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      location = "",
      type = "",
      skills = ""
    } = req.query;

    const filter = { status: "open" };

    // Exclude applied jobs
    if (req.user?.id) {
      filter["applicants.user"] = { $ne: req.user.id };
    }

    // Search filter
    if (search.trim() !== "") {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

    // Location filter
    if (location.trim() !== "") {
      filter.location = new RegExp(location, "i");
    }

    // Job type (employmentType) filter
    if (type.trim() !== "") {
      filter.employmentType = type;
    }

    // Skills filter
    if (skills.trim() !== "") {
      filter.skillsRequired = { $all: skills.split(",") };
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .populate("postedBy", "name userName companyName")
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      page,
      pages: Math.ceil(total / limit),
      jobs,
      total,
    });
  } catch (err) {
    console.error("Get Jobs Error:", err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

// GET JOB BY ID => GET /api/job/:id
export const getJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate('postedBy', 'name userName companyName')
      .populate("applicants.user", "name email userName skills profilePic bio resumeUrl");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    try {
      job.views = (job.views || 0) + 1;
      await job.save();
    } catch (saveErr) {
      console.error("Failed to increment job.views (non-fatal):", saveErr);
    }

    res.status(200).json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ message: "Error fetching job" });
  }
};

// UPDATE JOB => PUT /api/job/:id
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const allowedFields = [
      "title",
      "description",
      "skillsRequired",
      "employmentType",
      "location",
      "salary",
      "experience",
      "education",
      "status",
    ];

    const update = {};

    allowedFields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        const val = req.body[f];
        if (val !== "" && val !== null && typeof val !== "undefined") {
          update[f] = val;
        }
      }
    });

    if (update.skillsRequired && !Array.isArray(update.skillsRequired)) {
      if (typeof update.skillsRequired === "string") {
        update.skillsRequired = update.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        update.skillsRequired = Array.isArray(update.skillsRequired)
          ? update.skillsRequired
          : [];
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (err) {
    console.error("Error updating job:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Error updating job" });
  }
};

// DELETE JOB => DELETE /api/job/:id
export const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });

    // Remove from recruiter's postedJobs
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { postedJobs: jobId }
    });

    // Remove from all users' appliedJobs array
    await User.updateMany(
      { appliedJobs: jobId },
      { $pull: { appliedJobs: jobId } }
    );

    res.status(200).json({ message: "Job deleted successfully", deletedJob });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error deleting job" });
  }
};

// APPLY FOR JOB => POST /api/job/:id/apply
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const jobObjectId = new mongoose.Types.ObjectId(jobId);

    const alreadyApplied = user.appliedJobs.some(id => id.toString() === jobObjectId.toString());

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Add to user's appliedJobs
    user.appliedJobs.push(jobObjectId);
    await user.save();

    // Add to job's applicants with status "pending"
    await Job.findByIdAndUpdate(jobId, {
      $push: {
        applicants: {
          user: userId,
          appliedAt: new Date(),
          status: "pending",
        }
      }
    });

    // Increment clicks
    job.clicks += 1;
    await job.save();

    res.status(200).json({ message: "Job applied successfully" });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ message: err.message || "Error applying for job" });
  }
};


// GET JOB APPLICANTS => GET /api/job/:id/applicants
export const getApplicants = async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findById(jobId)
      .populate("applicants.user", "name email userName skills bio profilePic resumeUrl");

    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if user is the recruiter who posted this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view applicants" });
    }

    res.status(200).json(job.applicants);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching applicants" });
  }
}

// GET ALL APPLICANTS (for recruiter across all their jobs)
export const getAllApplicants = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({ postedBy: recruiterId })
      .populate("applicants.user", "name email skills bio profilePic userName resumeUrl")
      .select("title applicants");

    const applicants = [];

    jobs.forEach(job => {
      job.applicants.forEach(app => {
        applicants.push({
          jobId: job._id,
          jobTitle: job.title,
          appliedAt: app.appliedAt,
          status: app.status,
          user: app.user,
        });
      });
    });

    res.status(200).json(applicants);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

// GET POSTED JOBS BY RECRUITER => GET /api/job/posted
export const getPostedJobs = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;

    const skip = (page - 1) * limit;
    const filter = { postedBy: req.user.id };
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      page,
      pages: Math.ceil(total / limit),
      total,
      jobs,
    });

  } catch (err) {
    console.error("Error fetching posted jobs:", err);
    res.status(500).json({ message: "Error fetching posted jobs" });
  }
};

// GET RECOMMENDED JOBS => GET /api/job/recommended
export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recommendedJobs = await Job.find({
      skillsRequired: { $in: user.skills },
      status: "open",
      _id: { $nin: user.appliedJobs }
    })
      .populate("postedBy", "name companyName")
      .limit(6)
      .sort({ postedAt: -1 });

    res.status(200).json(recommendedJobs);
  } catch (err) {
    console.error("Error fetching recommended jobs:", err);
    res.status(500).json({ message: "Error fetching recommended jobs" });
  }
};

// UPDATE APPLICATION STATUS => PATCH /api/job/:jobId/applicant/:userId/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const { status } = req.body;

    console.log("Updating status for:", { jobId, userId, status });

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if current user is the recruiter who posted the job
    if (job.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    // Find the applicant in the job's applicants array
    const applicantIndex = job.applicants.findIndex(app => {
      const appUserId = app.user ? app.user.toString() : null;
      const paramUserId = userId.toString();
      return appUserId === paramUserId;
    });

    console.log("Applicant found at index:", applicantIndex);

    if (applicantIndex === -1) {
      return res.status(404).json({ message: "Applicant not found for this job" });
    }

    // Update status
    job.applicants[applicantIndex].status = status;
    await job.save({ validateModifiedOnly: true });

    console.log("Updated application status to:", status);

    res.status(200).json({
      success: true,
      message: `Application ${status}`,
      applicant: job.applicants[applicantIndex]
    });

  } catch (err) {
    console.error("Update application status error:", err);
    res.status(500).json({ message: "Error updating application status", error: err.message });
  }
};

// WITHDRAW APPLICATION => DELETE /api/job/:id/withdraw 
export const withdrawApplication = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find applicant in job's applicants array (source of truth)
    const applicant = job.applicants.find(app => {
      if (!app || !app.user) return false;
      return app.user.toString() === userId.toString();
    });

    if (!applicant) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (applicant.status !== "pending") {
      return res.status(400).json({
        message: `Cannot withdraw application with status: ${applicant.status}`
      });
    }

    // Remove from both user's appliedJobs and job's applicants arrays
    await User.findByIdAndUpdate(userId, {
      $pull: { appliedJobs: jobId }
    });

    await Job.findByIdAndUpdate(jobId, {
      $pull: { applicants: { user: userId } }
    });

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully"
    });

  } catch (err) {
    console.error("Withdraw application error:", err);
    res.status(500).json({ message: err.message || "Error withdrawing application" });
  }
};