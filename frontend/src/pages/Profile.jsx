import React from 'react'
import dp from '../assets/dp.jpg'
import { FaCamera } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';



function Profile() {
  let {userData}=useSelector((state)=>state.user);
  let dispatch=useDispatch();
  let navigate=useNavigate();
  let [name,setName]=useState(userData.name|| "");
  let [frontendImage,setfrontendImage]=useState(userData.image|| dp);
  let [backendImage,setBackendImage]=useState(null);
  let [saving,setSaving]=useState(false);
let image=useRef();

let handleImage=(e)=>{
  let file=e.target.files[0];
  setBackendImage(file);
  setfrontendImage(URL.createObjectURL(file));
}

const handleProfile = async (e) => {
  e.preventDefault();
  setSaving(true)
  try {
    let formData=new FormData()
    formData.append("name",name)
    if(backendImage){
      formData.append("image",backendImage)
    }

    let result= await axios.put(`${serverUrl}/api/user/profile`,formData,
      {withCredentials:true})
      setSaving(false)
      dispatch(setUserData(result.data))
      navigate("/")
  } catch (error) {
    console.log(`error in handleProfile in frontend ${error}`)
    setSaving(false)
  }

}

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center'>
      <div className='fixed top-5 left-5'>
        <IoArrowBackOutline className='text-gray-600 text-[30px] cursor-pointer' onClick={()=>navigate("/")} />
      </div>
      <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px] justify-center items-center'>
         <div className='w-full max-w-[200px] h-[200px] bg-white rounded-full border-4 border-[#20c7ff] overflow-hidden shadow-gray-400 shadow-lg'>
          <div className='w-full h-full relative group cursor-pointer flex justify-center items-center'>
            <img src={frontendImage} alt="dp"/>
            <div className='w-full h-full bg-black/50 absolute top-0 left-0 opacity-0 group-hover:opacity-100 flex justify-center items-center duration-300' onClick={()=>{image.current.click()}}>
                <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
                <FaCamera className='text-white text-[30px]'/>
            </div>
          </div>
          
        </div>
        <form className='w-full flex flex-col gap-[20px] items-center'onSubmit={handleProfile}>
            <input type="text" placeholder='Enter your name' className='w-[90%] h-[50px] rounded-lg outline-none border-2 border-[#20c7ff] focus:border-[#00bfff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-md text-gray-700 text-[19px]' onChange={(e)=>setName(e.target.value)} value={name}/>


            <input type="text" placeholder='User name' readOnly className='w-[90%] h-[50px] rounded-lg outline-none border-2 border-[#20c7ff] focus:border-[#00bfff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-md text-gray-400 text-[19px]' value={userData?.userName}/>


            <input type="email" placeholder='Email' readOnly className='w-[90%] h-[50px] rounded-lg outline-none border-2 border-[#20c7ff] focus:border-[#00bfff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-md text-gray-400 text-[19px]'
            value={userData?.email} />


            <button className='w-[90%] h-[50px] bg-[#43cffd] hover:bg-[#00bdfc] text-white font-bold text-[20px] rounded-lg shadow-gray-400 shadow-md duration-300' disabled={saving}>{saving?"Saving.....":"Save Profile"}</button>
         </form>
      </div>
       
    </div>
  )
}

export default Profile