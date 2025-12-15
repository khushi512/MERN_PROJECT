import React from "react";
import { useEffect } from "react";
import { getCurrentUser } from "../src/apiCalls/authCalls";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData } from "../src/redux/userSlice";

function useCurrentUser() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Only fetch if userData is not already set (prevents overwriting on signin/signup)
    if (userData) {
      console.log("User already in Redux, skipping fetch");
      return;
    }

    // Check if localStorage has user data
    const storedUser = localStorage.getItem("user");
    
    // If no stored user, don't fetch
    if (!storedUser) {
      console.log("No stored user, skipping fetch");
      dispatch(clearUserData());
      return;
    }

    async function fetchData() {
      try {
        console.log("Fetching current user");
        const data = await getCurrentUser();
        console.log("Fetched data:", data);

        if (data && typeof data === "object" && data._id) {
          // Wrap in { user: ... } format that setUserData expects
          dispatch(setUserData({ user: data }));
        } else {
          console.log("No valid user data returned");
          dispatch(clearUserData());
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.log("Error fetching user:", error);
        // Clear everything if fetch fails (user might be logged out)
        dispatch(clearUserData());
        localStorage.removeItem("user");
      }
    }

    fetchData();
  }, []); // Empty dependency array - only run on mount
}

export default useCurrentUser;