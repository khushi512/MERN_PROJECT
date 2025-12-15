import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title : {type: String, required:true},
    description : {type: String, required:true},
    skillsRequired : [{type: String, required:true }],
    postedBy : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    applicants : [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["pending", "rejected", "accepted", ], default: "pending" }, 
    }],    
    status : {type: String, enum: ["open", "closed"],default : "open"},
    postedAt : {type: Date, default : Date.now()},
    
    views: { type: Number, default: 0 }, // for job impressions
    clicks: { type: Number, default: 0 }, // optional, for “apply clicks” analytics

    employmentType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"] },
    location: { type: String },
    salary: { type: String },
    experience: { type: String },
    education: { type: String },
    updatedAt: { type: Date, default: Date.now },
});


jobSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Job = mongoose.model('Job', jobSchema);
export default Job;