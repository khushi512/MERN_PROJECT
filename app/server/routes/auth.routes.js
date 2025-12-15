import express from 'express';
import { SignIn, SignUp , LogOut, ForgotPassword} from "../controllers/auth.controllers.js";


const authRouter = express.Router()

authRouter.post('/signin', SignIn);
authRouter.post('/signup', SignUp);
authRouter.post('/logout', LogOut);
authRouter.post('/forgot-password', ForgotPassword);

export default authRouter;