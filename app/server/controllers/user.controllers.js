import User from '../models/user.model.js';

export const getProfile = async (req,res)=>{
    const userId= req.user.id;
    if(userId== undefined){
        return res.status(401).json({message: "Unauthorized access"});
    }
    try{
        const verifiedUser = await User.findById(userId).select('-password').populate('appliedJobs postedJobs');
        res.status(200).json(verifiedUser);
    }catch(err){
        console.error(err.message);
        throw err;
    }
};

export const updateProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    // Only allow specific fields to be updated
    const allowedUpdates = ["name", "userName", "bio", "skills"];
    const updates = {};

    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // don't return password field

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: "Error updating profile" });
  }
};


export const getAppliedJobs = async (req,res)=>{
    const userId = req.user.id;
    if(userId == undefined){
        return res.status(401).json({message: "Unauthorized access"});
    }
    try{
        const appliedJobs = await User.findById(userId).populate('appliedJobs');
        res.status(200).json(appliedJobs.appliedJobs);
    }catch(err){
        console.error(err.message);
        throw err;
    }
};

export const getPostedJobs = async (req, res) =>{
    const userId= req.user.id;
    if(userId == undefined){
        return res.status(401).json({message: "Unauthorized access"});
    }
    try{
        const postedJobs = await User.findById(userId).populate('postedJobs');
        res.status(200).json(postedJobs.postedJobs);
    }catch(err){
        console.error(err.message);
        throw err;
    }
};


// Save a job => POST /api/user/save/:jobId
export const saveJob = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;

  try {
    const user = await User.findById(userId);
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }
    user.savedJobs.push(jobId);
    await user.save();
    res.status(200).json({ message: "Job saved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error saving job" });
  }
};

// Unsave a job => DELETE /api/user/save/:jobId
export const removeSavedJob = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;

  try {
    await User.findByIdAndUpdate(userId, { $pull: { savedJobs: jobId } });
    res.status(200).json({ message: "Job removed from saved" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error removing saved job" });
  }
};

// Get saved jobs => GET /api/user/saved
export const getSavedJobs = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate('savedJobs');
    res.status(200).json(user.savedJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching saved jobs" });
  }
};
