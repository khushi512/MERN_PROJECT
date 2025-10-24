import express from 'express';
import { SignIn, SignUp } from "../controllers/auth.controllers.js";


const authRouter = express.Router()

authRouter.post('/signin', SignIn);
authRouter.post('/signup', SignUp);

export default authRouter;