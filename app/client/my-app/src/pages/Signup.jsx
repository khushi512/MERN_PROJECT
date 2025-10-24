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
        bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(129,140,248,0.25),transparent_35%),linear-gradient(135deg,#e0f2fe,#bfdbfe,#93c5fd)]
        flex flex-col justify-center items-center
        px-4
      "
    >
      <div className="
        w-full sm:max-w-[450px] 
        bg-white/95 
        rounded-2xl 
        shadow-lg 
        backdrop-blur-sm
        p-8 sm:p-10 
        flex flex-col items-center gap-6
      ">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">
            Join DesignHire
          </h1>
          <p className="text-gray-600 text-sm mt-1">
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
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-sm"
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
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-sm"
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
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-sm"
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
            className="w-full h-[44px] px-4 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          className="
            w-full h-[44px] 
            bg-blue-500 text-white font-semibold rounded-lg 
            hover:bg-blue-600 active:scale-[0.99] 
            transition 
            shadow-md
            mt-2
          "
        >
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-gray-600 text-sm mt-3">
          Already have an account?{" "}
          <span className="text-blue-500 font-medium hover:underline">
            <Link to="/signin">Sign In</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
