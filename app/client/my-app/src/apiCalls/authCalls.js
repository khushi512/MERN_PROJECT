import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
// ===== AUTH ROUTES =====

// POST /api/auth/signup
export const signUpUser = async ({ name, userName, userType, email, password }) => {
  try {
    const response = await api.post('/api/auth/signup', { name, userName, userType, email, password });
    return response.data;
  } catch (error) {
    console.error("SignUp error:", error.response?.data || error.message);
    return error.response?.data || { message: error.message };
  }
};

// POST /api/auth/signin
export const signInUser = async ({ userName, password }) => {
  try {
    console.log("Calling signin with:", { userName, password });
    console.log("API base URL:", API_BASE_URL);
    const response = await api.post('/api/auth/signin', { userName, password });
    console.log("SignIn success response:", response.data);
    return response.data;
  } catch (error) {
    console.error("SignIn API error:", error.response?.data || error.message);
    return error.response?.data || { message: error.message };
  }
};

// POST /api/auth/logout
export const logoutUser = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    return { message: "Logout failed" };
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error("ForgotPassword error:", error.response?.data || error.message);
    return error.response?.data || { message: error.message };
  }
};

// GET /api/user/profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    console.error("GetCurrentUser error:", error.response?.data || error.message);
    return null;
  }
};

// ===== USER ROUTES =====

// GET /api/user/profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    console.error("GetUserProfile error:", error);
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

// DELETE /api/job/:jobId/withdraw
export const withdrawApplication = async (jobId) => {
  try {
    const res = await api.delete(`/api/job/${jobId}/withdraw`);
    return res.data;
  } catch (err) {
    console.error("Error withdrawing application:", err);
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

// GET /api/job/posted?page=1&limit=6
export const getMyJobs = async ({ page = 1, limit = 6 } = {}) => {
  try {
    const res = await api.get('/api/job/posted', {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching posted jobs:", err);
    throw err;
  }
};

// ===== JOB ROUTES =====

// GET /api/job
export const getAllJobs = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/job?${query}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching all jobs:", err);
    throw err;
  }
};

// GET /api/job/:id
export const getJobById = async (id) => {
  try {
    const res = await api.get(`/api/job/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching job:", err);
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

// PUT /api/job/:id
export const updateJob = async (jobId, jobData) => {
  try {
    const res = await api.put(`/api/job/${jobId}`, jobData);
    return res.data;
  } catch (err) {
    console.error("Error updating job:", err);
    throw err;
  }
};

// DELETE /api/job/:id
export const deleteJob = async (jobId) => {
  try {
    const res = await api.delete(`/api/job/${jobId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting job:", err);
    throw err;
  }
};

// GET /api/job/recommended
export const getRecommendedJobs = async () => {
  try {
    const response = await api.get('/api/job/recommended');
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended jobs:", error);
    throw error.response?.data?.message || "Failed to fetch recommended jobs";
  }
};

// GET /api/job/all-applicants
export const getAllApplicantsList = async () => {
  try {
    const res = await api.get('/api/job/all-applicants');
    return res.data;
  } catch (err) {
    console.error("Error fetching applicants:", err);
    throw err;
  }
};

// PATCH /api/job/:jobId/applicant/:userId/status
export const updateApplicationStatus = async (jobId, userId, status) => {
  try {
    const res = await api.patch(`/api/job/${jobId}/applicant/${userId}/status`, { status });
    return res.data;
  } catch (err) {
    console.error("Error updating application status:", err);
    throw err;
  }
};

// GET /api/user/:id (Public profile)
export const getUserPublicProfile = async (userId) => {
  try {
    const res = await api.get(`/api/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching public profile:", err);
    throw err;
  }
};

// GET /api/user/download-resume/:filename
export const downloadResume = async (filename) => {
  try {
    const res = await api.get(`/api/user/download-resume/${filename}`);
    return res.data;
  } catch (err) {
    console.error("Error downloading resume:", err);
    throw err;
  }
};