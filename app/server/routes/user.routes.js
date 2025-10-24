import { getProfile, updateProfile, getAppliedJobs, getPostedJobs, getSavedJobs, saveJob, removeSavedJob } from "../controllers/user.controllers.js";
import express from "express";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();
userRouter.get('/profile', isAuth, getProfile);
userRouter.patch('/profile', isAuth, updateProfile);
userRouter.get('/applied', isAuth, getAppliedJobs);
userRouter.get('/posted', isAuth, getPostedJobs);
userRouter.post('/save/:jobId', isAuth, saveJob);
userRouter.delete('/save/:jobId', isAuth, removeSavedJob);
userRouter.get('/saved', isAuth, getSavedJobs);

export default userRouter;


