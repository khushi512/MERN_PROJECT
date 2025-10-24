import React, { useState } from "react";
import { Link } from "react-router-dom";
import {signUpUser} from "../apiCalls/authCalls"
import {setUserData} from '../redux/userSlice'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp= async()=>{
    if(!name || !userName || !email || !password){
      alert("Please enter all the fields");
      return;
    }
    const user = {
      name,
      userName,
      email,
      password
    }
    
    try{
        const data= await signUpUser({name, userName, email, password});
        console.log("Sign Up clicked", data);
        if(data && data.user){
          dispatch(setUserData(data));
          navigate('./home')
        }
        else{
          alert(data.message || "Signup failed");
        }
        
    }
    catch(error){
      console.error("Signup error: ", error.message);
    }
  }

  return (
    <div
      className="
        w-full min-h-screen 
        brand-gradient-bg
        flex flex-col justify-center items-center
        px-4
      "
    >
      <div className="
        w-full sm:max-w-[450px] 
        card 
        p-8 sm:p-10 
        flex flex-col items-center gap-6
      ">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold brand-gradient-text">
            Join DesignHire
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Connect with top creative talent
          </p>
        </div>

        {/* Input: Name */}
        <div className="relative w-full">
          <label
            htmlFor="name"
            className="absolute -top-2 left-3 text-xs px-1 bg-white text-gray-500"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Input: Username */}
        <div className="relative w-full">
          <label
            htmlFor="userName"
            className="absolute -top-2 left-3 text-xs px-1 bg-white text-gray-500"
          >
            Username
          </label>
          <input
            type="text"
            id="userName"
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none text-sm"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        {/* Input: Email */}
        <div className="relative w-full">
          <label
            htmlFor="email"
            className="absolute -top-2 left-3 text-xs px-1 bg-white text-gray-500"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Input: Password */}
        <div className="relative w-full">
          <label
            htmlFor="password"
            className="absolute -top-2 left-3 text-xs px-1 bg-white text-gray-500"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Sign Up Button */}
        <button onClick={handleSignUp} className="w-full btn-primary mt-2">
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-slate-600 text-sm mt-3">
          Already have an account?{" "}
          <span className="text-teal-700 font-medium hover:underline">
            <Link to="/signin">Sign In</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
