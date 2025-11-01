import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.jpg'
import { FaSearch } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { TbLogout2 } from "react-icons/tb";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';


function SideBar() {
    let {userData,otherUsers, selectedUser,onlineUsers,searchData}= useSelector(state=>state.user)
    let [search,setSearch]=useState(false)
    let dispatch=useDispatch()
    let navigate=useNavigate()
    let [input,setInput]=useState("")

    const handleLogOut=async()=>{
      try {
        let result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null))
        dispatch(setOtherUsers(null))
        navigate("/login")
      } catch (error) {
        console.log(`error in handleLogout function ${error}`)
      }
    }


// search

const handleSearch=async()=>{
      try {
        let result=await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
        dispatch(setSearchData(result.data))
      
        
      } catch (error) {
        console.log(`error in handlesearch function ${error}`)
      }
    }


    useEffect(()=>{
      if(input){
      handleSearch()
      }
    },[input])


  return (
    <div className={`lg:w-[30%] w-full h-full lg:block ${selectedUser? "hidden":"block"} bg-slate-200  overflow-hidden relative`}>
      <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-[#20c7ff] cursor-pointer mt-[10px] fixed bottom-[20px] left-[10px] ' onClick={handleLogOut}>
                <TbLogout2  className='font-bold w-[28px] h-[28px]' />
                </div>
         <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]'>
{input.length>0 && <div className='w-full h-full absolute top-[235px] left-0 bg-white z-10 overflow-auto shadow-lg rounded-lg px-[10px] py-[10px]'>
                          {searchData?.map((user)=>(
                             <div className='w-[95%] h-[80px] flex justify-start items-center gap-[20px] cursor-pointer duration-300 hover:bg-blue-200 bg-white border-b-2 border-gray-400 px-[20px]' onClick={()=>{
                              dispatch(setSelectedUser(user))
                              setInput("")
                              setSearch(false)
                             }}>
                   <div>
                   <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg mt-[10px] bg-white'>
                    <img src={user.image || dp} alt='' className='h-[100%]'/>
                </div>
                  { onlineUsers?.includes(user._id) &&
                <span className='w-[15px] h-[15px] rounded-full bg-green-600 border-2 border-white absolute mt-[-20px] ml-[35px]'></span>}
                </div>
                   <h1 className='font-semibold text-[20px] text-gray-800'>{user.name || user.userName}</h1>
                </div>
                          ))}
                      </div>}

            <h1 className='text-white font-bold text-[25px]'>Chat Karo</h1>


            <div className='w-full flex justify-between items-center'>


                <h1 className='text-gray-800 font-bold text-[25px]'>Hii , {userData.name || "User"}</h1>

                {/* image */}
                <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white'>
                    <img src={userData.image || dp} alt='' className='h-[100%] cursor-pointer' onClick={()=>navigate("/profile")}/>
                </div>
            </div>
            <div className='w-full flex items-center gap-[20px]'>
            {/* search */}
            {!search &&  <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white cursor-pointer mt-[10px]' onClick={()=>{setSearch(true)}}>
                <FaSearch className='font-bold' />
                </div> }
                {search && 
                  <form className='w-full h-[50px] shadow-gray-500 shadow-lg bg-white flex items-center gap-[10px] rounded-full mt-[10px] overflow-hidden px-[20px]'>
                      <FaSearch className='font-bold w-[25px] h-25px]' />
                      <input type='text' placeholder='Search Users' className='w-full h-full p-[10px] outline-none border-0 text-[17px]' onChange={(e) => setInput(e.target.value)} value={input}/>
                      <RxCross1 className=' font-extrabold w-[30px] h-30px] cursor-pointer' onClick={()=>{
                        setSearch(false) 
                        setInput("")}}/>


                      
                      {/* <button className='bg-[#43cffd] hover:bg-[#00bdfc] text-white font-semibold text-[15px] rounded-lg shadow-gray-400 shadow-md duration-300'>Search</button> */}
                  </form>
                }

                {!search &&  otherUsers?.map((user)=>(
                  onlineUsers?.includes(user._id) &&
                  <div>
                   <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg mt-[10px] bg-white cursor-pointer' onClick={()=>dispatch(setSelectedUser(user))}>
                    <img src={user.image || dp} alt='' className='h-[100%]'/>
                </div>
                <span className='w-[15px] h-[15px] rounded-full bg-green-600 border-2 border-white absolute mt-[-20px] ml-[35px]'></span>
                </div>
                )) }
                </div>
             
         </div>
         
         
         <div className='w-full h-[59%] lg:h-[47%] overflow-auto flex flex-col gap-[10px] items-center'>
         { otherUsers?.map((user)=>(
          
          <div className='w-[95%] h-[60px] flex justify-start items-center gap-[20px] shadow-gray-500 bg-white shadow-sm rounded-full overflow-hidden mt-[10px] ml-[10px] cursor-pointer hover:shadow-lg duration-300 hover:bg-blue-100' onClick={()=>dispatch(setSelectedUser(user))}>
                   <div>
                   <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg mt-[10px] bg-white'>
                    <img src={user.image || dp} alt='' className='h-[100%]'/>
                </div>
                  { onlineUsers?.includes(user._id) &&
                <span className='w-[15px] h-[15px] rounded-full bg-green-600 border-2 border-white absolute mt-[-20px] ml-[35px]'></span>}
                </div>
                   <h1 className='font-semibold text-[20px] text-gray-800'>{user.name || user.userName}</h1>
                </div>
                )) }
         </div>

    </div>
  )
}

export default SideBar