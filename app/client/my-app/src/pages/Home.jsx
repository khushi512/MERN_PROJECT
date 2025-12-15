import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashboardApplicant from "./DashboardApplicant";
import DashboardRecruiter from "./DashboardRecruiter.jsx.jsx";

function Home() {
  const { userData } = useSelector((state) => state.user);

  // If user isn't loaded yet, show nothing or loading
  if (!userData) {
    return <Navigate to="/signin" />;
  }

  // Route based on userType - if userType is set correctly during signup/signin
  if (userData.userType === "recruiter") {
    return <DashboardRecruiter />;
  }

  // Default to applicant dashboard
  return <DashboardApplicant />;
}

export default Home;
