import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createJob, getJob, getJobs, updateJob, deleteJob, applyJob, getApplicants } from '../controllers/job.controllers.js';

const jobRouter = express.Router();

jobRouter.get('/', getJobs);
jobRouter.post('/', isAuth, createJob);
jobRouter.get('/:id', getJob);
jobRouter.put('/:id', isAuth, updateJob);
jobRouter.delete('/:id', isAuth, deleteJob);
jobRouter.post('/:id/apply', isAuth, applyJob);
jobRouter.get('/:id/applicants', isAuth, getApplicants);

export default jobRouter;