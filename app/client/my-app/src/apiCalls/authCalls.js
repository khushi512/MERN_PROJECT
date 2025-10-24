import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ===== AUTH ROUTES =====

// POST /api/auth/signup
export const signUpUser = async ({ name, userName, email, password }) => {
  try {
    const response = await api.post('/api/auth/signup', { name, userName, email, password });
    return response.data;
  } catch (error) {
    return error;
  }
};

// POST /api/auth/signin
export const signInUser = async ({ userName, password }) => {
  try {
    const response = await api.post('/api/auth/signin', { userName, password });
    return response.data;
  } catch (error) {
    return error;
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    return error;
  }
};

// GET /api/user/profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

// ===== USER ROUTES =====

// GET /api/user/profile + /applied + /posted combined
export const getUserProfile = async () => {
  try {
    const [profileRes, appliedRes, postedRes] = await Promise.all([
      api.get('/api/user/profile'),
      api.get('/api/user/applied'),
      api.get('/api/user/posted'),
    ]);

    return {
      ...profileRes.data,
      appliedJobs: appliedRes.data || [],
      postedJobs: postedRes.data || [],
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch profile details";
  }
};

// PATCH /api/user/profile
export const updateUserProfile = async (updatedData) => {
  try {
    const response = await api.patch('/api/user/profile', updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error.response?.data?.message || "Failed to update profile.";
  }
};


// GET /api/user/applied
export const getAppliedJobs = async () => {
  try {
    const res = await api.get('/api/user/applied');
    return res.data;
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    throw err;
  }
};

// GET /api/user/posted
export const getMyJobs = async () => {
  try {
    const res = await api.get('/api/user/posted');
    return res.data;
  } catch (err) {
    console.error("Error fetching posted jobs:", err);
    throw err;
  }
};

// GET /api/user/saved
export const getSavedJobs = async () => {
  try {
    const res = await api.get('/api/user/saved');
    return res.data;
  } catch (err) {
    console.error("Error fetching saved jobs:", err);
    throw err;
  }
};

// POST /api/user/save/:jobId
export const saveJob = async (jobId) => {
  try {
    const res = await api.post(`/api/user/save/${jobId}`);
    return res.data;
  } catch (err) {
    console.error("Error saving job:", err);
    throw err;
  }
};

// DELETE /api/user/save/:jobId
export const removeSavedJob = async (jobId) => {
  try {
    const res = await api.delete(`/api/user/save/${jobId}`);
    return res.data;
  } catch (err) {
    console.error("Error removing saved job:", err);
    throw err;
  }
};

// ===== JOB ROUTES =====

// GET /api/job
export const getAllJobs = async () => {
  try {
    const res = await api.get('/api/job');
    return res.data;
  } catch (err) {
    console.error("Error fetching all jobs:", err);
    throw err;
  }
};

// POST /api/job
export const createJob = async (jobData) => {
  try {
    const res = await api.post('/api/job', jobData);
    return res.data;
  } catch (err) {
    console.error("Error creating job:", err);
    throw err;
  }
};

// POST /api/job/:id/apply
export const applyToJob = async (jobId) => {
  try {
    const res = await api.post(`/api/job/${jobId}/apply`);
    return res.data;
  } catch (err) {
    console.error("Error applying to job:", err);
    throw err;
  }
};
