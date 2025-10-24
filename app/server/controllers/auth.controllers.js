import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import genToken from "../config/token.js";;

export const SignIn = async (req, res)=>{
    const {userName, password} = req.body;

    if(!userName || !password){
        return res.status(400).json({message: "Please enter all the fields"});
    }

    let existingUser = await User.findOne({userName});
        
    if(!existingUser){
        return res.status(404).json({message : "User not found"});
    }
    let checkPassword = await bcrypt.compare(password, existingUser.password);
    if(!checkPassword){
        return res.status(400).json({message: "Invalid password"});
    }

    let token = await genToken(existingUser._id);
    res.cookie("token", token, {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict',
        maxAge : 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({message: "Login successful", user : existingUser});
}

export const SignUp = async (req, res)=>{
    console.log(req.body);
    try {
        
        const { name, userName, email, password, bio, skills } = req.body;

        if (!name || !userName || !email || !password) {
            return res.status(400).json({ message: "Please enter all the fields" });
        }

        let existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({ message: "UserName already exists" });
        }

        let existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, userName, email, password: hashedPassword, bio, skills });
        const token = await genToken(newUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}