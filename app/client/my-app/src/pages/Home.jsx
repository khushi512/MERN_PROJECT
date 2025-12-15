import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashboardRecruiter from "./DashboardRecruiter.jsx";
import DashboardApplicant from "./DashboardApplicant";

function Home() {
  const { userData } = useSelector((state) => state.user);
  
  // If not authenticated, redirect to signin
  if (!userData) {
    return <Navigate to="/signin" />;
  }
  const userType = userData.userType;
  // Route based on userType
  if (userType === "recruiter") {
    return <DashboardRecruiter />;
  }

  if (userType === "applicant") {
    return <DashboardApplicant />;
  }

  // Fallback (shouldn't reach here if userType is set correctly)
  return <Navigate to="/signin" />;
}

export default Home;