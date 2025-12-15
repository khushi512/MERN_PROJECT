import { getProfile, updateProfile, getAppliedJobs, getSavedJobs, saveJob, removeSavedJob, getUserById, downloadResume } from "../controllers/user.controllers.js";
import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { isApplicant } from "../middlewares/userTypeCheck.js";
import  upload  from "../middlewares/upload.js";

const userRouter = express.Router();

// Profile routes
userRouter.get('/profile', isAuth, getProfile);
userRouter.patch('/profile', isAuth, upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'resumeUrl', maxCount: 1 }
]), updateProfile);

// Applied jobs routes (applicant only)
userRouter.get('/applied', isAuth, isApplicant, getAppliedJobs);
// Saved jobs routes (applicant only)
userRouter.post('/save/:jobId', isAuth, isApplicant, saveJob);
userRouter.delete('/save/:jobId', isAuth, isApplicant, removeSavedJob);
userRouter.get('/saved', isAuth, isApplicant, getSavedJobs);

// Download resume
userRouter.get('/download-resume/:filename', isAuth, downloadResume);

// Get user by ID (public profile)
userRouter.get('/:id', isAuth, getUserById);

export default userRouter;