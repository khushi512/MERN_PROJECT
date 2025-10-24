import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
        name : 'user',
        initialState : {
            userData : null
        },
        reducers : {
            setUserData : (state, action)=>{
                state.userData = action.payload
                state.error = null
            },

            clearUserData : (state)=>{
                state.userData = null
            }
        }
})

export const {setUserData, clearUserData} = userSlice.actions;
export default userSlice.reducer;