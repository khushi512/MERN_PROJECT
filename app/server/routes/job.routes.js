import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { isAuthOptional } from '../middlewares/isAuthOptional.js';
import {isRecruiter, isApplicant} from '../middlewares/userTypeCheck.js';
import { createJob, getJob, getPostedJobs, getJobs, updateJob, deleteJob, applyJob, getApplicants, getAllApplicants, getRecommendedJobs, withdrawApplication, updateApplicationStatus } from '../controllers/job.controllers.js';

const jobRouter = express.Router();

jobRouter.get('/', isAuthOptional, getJobs);

// Only recruiters can access these routes
jobRouter.post('/', isAuth, isRecruiter, createJob);
jobRouter.get('/posted', isAuth, isRecruiter, getPostedJobs);

jobRouter.get("/all-applicants", isAuth, isRecruiter, getAllApplicants);
jobRouter.get('/recommended', isAuth, isApplicant, getRecommendedJobs);

jobRouter.get('/:id/applicants', isAuth, isRecruiter, getApplicants);

jobRouter.delete('/:id/withdraw', isAuth, isApplicant, withdrawApplication);

jobRouter.put('/:id', isAuth, isRecruiter, updateJob);
jobRouter.delete('/:id', isAuth, isRecruiter, deleteJob);

// Update application status (recruiter accepts/rejects)
jobRouter.patch('/:jobId/applicant/:userId/status', isAuth, isRecruiter, updateApplicationStatus);

jobRouter.get('/:id', isAuthOptional, getJob);

// Only applicants can access these routes
jobRouter.post('/:id/apply', isAuth, isApplicant, applyJob);

export default jobRouter;


