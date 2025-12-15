import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required:true, trim: true},
    userName : {type: String, required:true, unique:true, lowercase: true, trim: true},
    userType : {type: String, enum: ['applicant', 'recruiter'], required: true},
    email : {type: String, required: true, unique: true, lowercase: true, trim: true},
    password : {type: String, required: true},
    
    bio : {type: String, default: "",},
    skills : [{type: String}],
    resumeUrl : {type : String, default : ""},
    profilePic : {type : String, default : ""},

    // Applicant-specific fields
    appliedJobs : [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    savedJobs : [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    // Recruiter-specific fields
    postedJobs : [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    companyName: {type: String, default: "",},
    companyWebsite: {type: String, default: "",},
    companyLocation: {type: String,default: "",},
    
}) 

const User = mongoose.model('User', userSchema);
export default User;
