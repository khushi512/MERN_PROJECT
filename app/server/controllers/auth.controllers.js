import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import genToken from "../config/token.js";

//SignIn User
export const SignIn = async (req, res) => {
    try {
        const { userName, password } = req.body;
        // Validate input
        if (!userName || !password) {
            return res.status(400).json({ message: "Please enter all the fields" });
        }
        // Find user by username
        let existingUser = await User.findOne({ userName });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check password
        let checkPassword = await bcrypt.compare(password, existingUser.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        let token = await genToken(existingUser);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({ message: "Login successful", user: existingUser, token, });

    } catch (err) {
        console.error("signin error", err.message);
        res.status(500).json({ message: err.message || 'Server error during signup' });
    }
}

//SignUp User
export const SignUp = async (req, res) => {
    console.log(req.body);
    try {
        const { name, userName, userType, email, password, bio, skills } = req.body;

        // Validate userType
        if (!['applicant', 'recruiter'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid user type. Must be applicant or recruiter.' });
        }
        // Validate required fields
        if (!name || !userName || !email || !password) {
            return res.status(400).json({ message: "Please enter all the fields" });
        }
        // Check if username already exists
        let existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({ message: "UserName already exists" });
        }
        // Check if email already exists
        let existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, userName, email, password: hashedPassword, userType, bio, skills });
        const token = await genToken(newUser);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({ message: "User created successfully", user: newUser, token, });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error during signup' });
    }
}

//Logout User
export const LogOut = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
}

// Forgot Password
export const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please provide email" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }
        // Generate reset token
        const resetToken = await genToken(user);
        // In real application, send this token via email to user
        res.status(200).json({
            message: 'Password reset token sent to email',
            resetToken, // Remove this in production, send via email instead
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error updating password" });
    }
}