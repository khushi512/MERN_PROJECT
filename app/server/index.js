import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import jobRouter from './routes/job.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app=express();
const PORT= 8001;

//Middlewares
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Raw Body:", req.body);
    next();
});

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
connectDB(); 

//Authentication and User Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);


app.get('/',(req,res)=>{
    res.send('DesignHire API is running!');
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
