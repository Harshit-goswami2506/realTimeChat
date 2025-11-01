import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';




function SignUp() {
    let navigate=useNavigate();
    let [showPassword,setShowPassword]=useState(false);
    let [userName,setUserName]=useState("");
    let [email,setEmail]=useState("");
    let [password,setPassword]=useState("");       
    let [loading,setLoading]=useState(false); 
    let [error,setError]=useState(""); 
    let dispatch=useDispatch();
    

    const handleSignUp=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError("");
        if (!userName || !email || !password) {
            setError("*Please fill all the fields");
            setLoading(false);
            return;
        }
        // Add sign-up logic here
        try {
            let result=await axios.post(`${serverUrl}/api/auth/signup`,{
                // user data
            userName,email,password
            },{withCredentials:true});
            dispatch(setUserData(result.data));
            setLoading(false);

        } catch (error) {
           console.log(error); 
           setLoading(false);  
        }
    }
  return (
    <div className='w-full h-[100vh] bg-slate-200 flex justify-center items-center'>
        <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
            <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center items-center'>
                <h1 className='text-gray-600 font-bold text-[30px]'>Welcome to <span className='text-white'>Chat Karo</span></h1>
            </div>
             <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleSignUp}>
            <input type="text" placeholder='User name' className='w-[90%] h-[50px] rounded-lg outline-none border-2 border-[#20c7ff] focus:border-[#00bfff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-md text-gray-700 text-[19px]' onChange={(e)=>setUserName(e.target.value)} />
            
            
            <input type="email" placeholder='Email' className='w-[90%] h-[50px] rounded-lg outline-none border-2 border-[#20c7ff] focus:border-[#00bfff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-md text-gray-700 text-[19px]' onChange={(e)=>setEmail(e.target.value)}/>
 
            <div className='w-[90%] h-[50px] rounded-lg border-2 border-[#20c7ff] focus-within:border-[#00bfff] overflow-hidden bg-white shadow-gray-400 shadow-md relative'>
            <input type={`${showPassword?"text":"password"}`} placeholder='Password' className='w-full h-full rounded-lg outline-none focus:border-[#00bfff] px-[20px] py-[10px] bg-white text-gray-700 text-[19px]' onChange={(e)=>setPassword(e.target.value)}/>
           {!showPassword && <FaEye className='absolute top-[15px] right-[20px] text-[19px] text-[#02befd] font-semibold cursor-pointer w-[25px] h-[20px]' onClick={()=>setShowPassword(true)}/>}
              {showPassword && <FaEyeSlash className='absolute top-[15px] right-[20px] text-[19px] text-[#02befd] font-semibold cursor-pointer w-[25px] h-[20px]' onClick={()=>setShowPassword(false)}/>}
            </div>
              {error && <p className='text-red-500'>{error}</p>}
           
            <button className='w-[90%] h-[50px] rounded-lg bg-[#20c7ff] text-white font-bold text-[20px] hover:bg-[#00bfff] shadow-gray-400 shadow-md' disabled={loading} >Sign Up</button>
           
           
           
            <p className='text-gray-600 cursor-pointer' onClick={()=>navigate("/login") }>Already have an account? <span className='text-[#20c7ff] font-bold'>{loading?"Loading...":"Login"}</span></p>
        </form>
        </div>
       
    </div>
  )
}

export default SignUp