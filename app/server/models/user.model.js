import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    userName : {type: String, required:true, unique:true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    bio : {type: String},
    skills : [{type: String}],
    resumeUrl : {type : String, default : ""},
    appliedJobs : [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    postedJobs : [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    savedJobs : [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    profilePic : {type : String, default : ""}
}) 

const User = mongoose.model('User', userSchema);
export default User;
