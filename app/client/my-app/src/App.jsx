import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import Browse from './pages/Browse';
import Saved from './pages/Saved';
import CreateJob from './pages/CreateJob';
import MyJobs from './pages/MyJobs';
import AppliedJobs from './pages/AppliedJobs';
import JobDetails from "./pages/JobDetails";
import EditJob from "./pages/EditJobs";
import AllApplicants from './pages/AllApplicants';
import ProfileApplicantPublic from './pages/ProfileApplicantPublic';

import useCurrentUser from "../hooks/useCurrentUser";
import { useSelector } from "react-redux";
import ProfileApplicant from './pages/ProfileApplicant';
import ProfileRecruiter from './pages/ProfileRecruiter';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

// Navigate to redirect routes 

function App() {
  useCurrentUser(); // reference the hook function
  const { userData } = useSelector((state) => state.user);

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={!userData ? <Landing /> : <Navigate to="/home" />} />
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/home" />} />
        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/home" />} />
        {/* Protected Routes */}
        <Route path="/home" element={userData ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/explore" element={userData ? <Browse /> : <Navigate to="/signin" />} />
        <Route path="/profile" element={userData && userData.userType === "recruiter" ? <ProfileRecruiter /> : <ProfileApplicant />} />

        <Route path="/saved" element={userData && userData.userType === "applicant" ? <Saved /> : <Navigate to="/signin" />} />
        <Route path="/applied-jobs" element={userData && userData.userType === "applicant" ? <AppliedJobs /> : <Navigate to="/signin" />} />

        <Route path="/create-job" element={userData && userData.userType === "recruiter" ? <CreateJob /> : <Navigate to="/signin" />} />
        <Route path="/edit-job/:id" element={userData && userData.userType === "recruiter" ? <EditJob /> : <Navigate to="/signin" />} />
        <Route path="/my-jobs" element={userData && userData.userType === "recruiter" ? <MyJobs /> : <Navigate to="/signin" />} />
        <Route path="/job/:id" element={userData && userData.userType === "recruiter" ? <JobDetails /> : <Navigate to="/signin" />} />
        <Route path="/all-applicants" element={userData && userData.userType === "recruiter" ? <AllApplicants /> : <Navigate to="/signin" />} />
        <Route path="/profile/:id" element={userData && userData.userType === "recruiter" ? <ProfileApplicantPublic /> : <Navigate to="/signin" />} />

        {/*Catch-all route to handle undefined routes */}
        <Route path="*" element={<Navigate to={userData ? "/home" : "/"} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;