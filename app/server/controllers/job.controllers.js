import Job from "../models/job.model.js";
import User from "../models/user.model.js";

//CREATE JOB => POST /api/job
export const createJob = async (req , res)=>{
    const {title, description, skillsRequired} = req.body;
    if(!title || !description || !skillsRequired){
        return res.status(400).json({message: "Please enter all the fields"});
    }
    try{
        const newJob = await Job.create({title, description, skillsRequired, postedBy : req.user.id})
        const user = await User.findById(req.user.id);
        user.postedJobs.push(newJob._id);
        await user.save();
        res.status(201).json(newJob);
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Error creating job" });
    }
};

//GET ALL JOBS => GET /api/job
export const getJobs = async (req,res) =>{
    try{
        const jobs = await Job.find()
        .populate('postedBy', 'name userName')
        .sort({ createdAt: -1 });
        res.status(200).json(jobs);
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Error fetching jobs" });
    }
};

// GET JOB BY ID (ID FROM ROUTING PARAMS)=> GET /api/job/:id
export const getJob = async (req, res) =>{
    const jobId = req.params.id;
    try{
        const job = await Job.findById(jobId).populate('postedBy', 'name userName');
        if(!job){
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Error fetching job" });    
    }
};

// UPDATE JOB => PUT /api/job/:id
export const updateJob = async (req,res) =>{
    const jobId = req.params.id;
    try{
        const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {new: true});
        if (!updatedJob) return res.status(404).json({ message: "Job not found" });
        res.status(200).json(updatedJob);
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Error updating job" });
    }
};

// DELETE JOB => DELETE /api/job/:id
export const deleteJob = async (req, res) =>{
    const jobId = req.params.id;
    try{
        const deletedJob = await Job.findByIdAndDelete(jobId);
        if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { postedJobs: jobId }
        });
        res.status(200).json({message: "Job deleted successfully", deletedJob});
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Error deleting job" });
    }
};

//APPLY FOR JOB => POST /api/job/:id/apply
export const applyJob = async (req, res) =>{
    const jobId = req.params.id;
    try{
        const user = await User.findById(req.user.id);
        if (user.appliedJobs.includes(jobId)) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }
        user.appliedJobs.push(jobId);
        await user.save();

        await Job.findByIdAndUpdate(jobId, {
            $push: {applicants: req.user.id}
        })
        res.status(200).json({message: "Job applied successfully"});
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Error applying for job" });
    }
};

// GET JOB APPLICANTS => GET /api/job/:id/applicants
export const getApplicants = async (req, res) =>{
    const jobId = req.params.id;
    try{
        const job = await Job.findById(jobId).populate('applicants');
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.status(200).json(job.applicants);
    }catch(err){
        console.error(err.message);
        res.status(500).json({ message: "Error fetching applicants" });
    }
}
