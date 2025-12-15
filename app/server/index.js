import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import jobRouter from './routes/job.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8001;

// Get __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://mern-project-zeta-pink.vercel.app",
            process.env.FRONTEND_URL
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// ⭐ Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Raw Body:", req.body);
    next();
});

connectDB();

// Authentication and User Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);

app.get('/', (req, res) => {
    res.send('DesignHire API is running!');
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("=== GLOBAL ERROR HANDLER ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Error field:", err.field);
    console.error("Error stack:", err.stack);

    if (err.name === 'MulterError') {
        console.error("MULTER ERROR DETAILS:", err);
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    if (err.message && err.message.includes('Invalid file')) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});