import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: JSON.parse(localStorage.getItem("user")) || null,
        userType: JSON.parse(localStorage.getItem("user"))?.userType || null,
    },
    reducers: {
        setUserData: (state, action) => {
            // Extract user from action.payload
            // action.payload comes as { user: {...} }
            const user = action.payload.user || action.payload;
            
            state.userData = user;
            state.userType = user?.userType || null;
            
            // Store only the user object in localStorage
            localStorage.setItem("user", JSON.stringify(user));
        },
        clearUserData: (state) => {
            state.userData = null;
            state.userType = null;
            localStorage.removeItem("user");
        }
    }
})

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;