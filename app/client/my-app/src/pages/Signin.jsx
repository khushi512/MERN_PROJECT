import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import {signInUser} from "../apiCalls/authCalls"
import {setUserData} from '../redux/userSlice'
import {useDispatch} from 'react-redux'

function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async()=>{
    if(!userName || !password){
      alert("Please enter username and password");
      return;
    }
    try{
      const data = await signInUser({userName, password});
      console.log("Sign In Clicked", data);
      if(data && data.user){
        dispatch(setUserData(data))
        navigate('/home')
      }
      else{
        alert("Invalid username or password");
      }
      
    }
    catch(error){
      console.error("Signin error: ", error);
    }
  }

  return (
    <div
      className="
        w-full min-h-screen 
        bg-[radial-gradient(1200px_800px_at_10%_-10%,#f58529_0%,transparent_35%),radial-gradient(1200px_800px_at_110%_0%,#dd2a7b_0%,transparent_40%),radial-gradient(900px_700px_at_50%_110%,#8134af_0%,transparent_45%),linear-gradient(180deg,#515bd4,#8134af)]
        flex items-center justify-center
      "
    >
      <div className="w-[95%] lg:max-w-[60%] h-[600px] rounded-2xl flex justify-center items-center overflow-hidden">
        {/* LEFT (form) */}
        <div
          className="
            w-full lg:w-1/2 h-full 
            bg-white 
            flex flex-col items-center justify-center
            px-6 sm:px-10 
            gap-5
            shadow-[0_10px_40px_rgba(0,0,0,0.2)]
          "
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-neutral-700">
              Sign In to DesignHire
            </h2>
          </div>
          {/* Inputs */}
          <div className="w-full flex flex-col items-center gap-3">
            <input
              type="text"
              id="userName"
              placeholder="Username"
              className="w-[95%] h-[44px] px-3 rounded-md border border-neutral-300 bg-neutral-50 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              id="password"
              placeholder="Password"
              className="w-[95%] h-[44px] px-3 rounded-md border border-neutral-300 bg-neutral-50 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Forgot password */}
          <div className="w-[95%] text-right mt-1 text-sm text-[#0095F6] cursor-pointer hover:underline">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          {/* Button */}
          <button
            onClick ={handleSignIn}
            className="
              w-[95%] h-[44px] mt-4 rounded-lg font-semibold 
              bg-[#0095F6] text-white 
              hover:bg-[#0086dd] active:scale-[0.99] transition
              shadow-[0_6px_16px_rgba(0,149,246,0.35)]
            "
          >
            Sign in
          </button>
          {/* Footer text */}
          <p className="text-neutral-500 text-sm mt-3">
            Want to create a new account?{" "}
            <span className="text-neutral-900 font-medium underline underline-offset-4">
              <Link to="/signup"> Sign Up</Link>
            </span>
          </p>
        </div>
        {/* RIGHT (promo panel) */}
        <div
          className="
            md:w-1/2 h-full hidden lg:flex flex-col items-center justify-center 
            bg-white/10 backdrop-blur-[1px]
            text-white font-semibold
          "
        >
          <p className="text-2xl font-bold mb-2">DesignHire</p>
          <p className="mt-4 text-white/95">Connecting Creative Talent</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
