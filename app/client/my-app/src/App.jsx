import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import CreateJob from './pages/CreateJob';
import MyJobs from './pages/MyJobs';
import AppliedJobs from './pages/AppliedJobs';
import Showcase from './pages/Showcase';

import useCurrentUser from "../hooks/useCurrentUser";
import { useSelector } from "react-redux";
// Navigate to redirect routes 

function App() {
  useCurrentUser();
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <Routes>
        <Route path="/" element={!userData ? <Landing /> : <Navigate to="/home"/>}/>
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/home"/>} />
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/home"/>} />
        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/home"/>} />
      {/* Protected Routes */}
        <Route path="/home" element={userData ?<Home /> : <Navigate to="/signin" />} />
        <Route path="/explore" element={userData ?<Browse /> : <Navigate to="/signin" />} />
        <Route path="/profile" element={userData ?<Profile /> : <Navigate to="/signin" />} />
        <Route path="/saved" element={userData ?<Saved /> : <Navigate to="/signin" />} />
        <Route path="/showcase" element={<Showcase />} />

        <Route path="/create-job" element={userData ? <CreateJob /> : <Navigate to="/signin" />} />
        <Route path="/my-jobs" element={userData ? <MyJobs /> : <Navigate to="/signin" />} />
        <Route path="/applied-jobs" element={userData ? <AppliedJobs /> : <Navigate to="/signin" />} />
      {/*Catch-all route to handle undefined routes */}
        <Route path="*" element={<Navigate to={userData ? "/home" : "/"} />} />
      </Routes>
    </>
  );
}

export default App;

