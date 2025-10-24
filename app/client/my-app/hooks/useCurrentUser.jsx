import React from "react";
import {useEffect} from "react";
import { getCurrentUser } from "../src/apiCalls/authCalls";
import { useDispatch } from "react-redux";
import {setUserData} from "../src/redux/userSlice";


function useCurrentUser(){
    const dispatch = useDispatch()
    useEffect(()=>{
        async function fetchData(){
            try{
                console.log("Fetching current user");
                const data = await getCurrentUser();
                console.log(data);
                if(data && typeof data ==='object'){
                    dispatch(setUserData(data));
                }
                else{
                    dispatch(clearUserData());
                }
            }
            catch(error){
                console.log(error);
                dispatch(setUserData(null));
            }
            
        }
        fetchData();
    }, []);
}
export default useCurrentUser;
