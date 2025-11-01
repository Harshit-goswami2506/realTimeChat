import React, { useEffect, useState } from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import dp from '../assets/dp.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { MdEmojiEmotions } from "react-icons/md";
import { FaImages } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReciverMessage from './ReciverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { useRef } from 'react';
import { setMessages } from '../redux/messageSlice';


function MessageArea() {
  let {selectedUser,userData,socket}=useSelector((state)=>state.user);
  let dispatch=useDispatch();
  let [showPicker,setShowPicker]=useState(false);
  let [input,setInput]=useState("");
  let [frontendImage,setFrontendImage]=useState(null);
  let [backendImage,setBackendImage]=useState(null);
  let image= useRef()
  let {messages}=useSelector(state=>state.message);

  const handleImage=(e)=>{
  let file=e.target.files[0];
  setBackendImage(file);
  setFrontendImage(URL.createObjectURL(file));
}

  const handleSendMessage=async(e)=>{
    e.preventDefault();
    if(input.length==0 && backendImage==null){
      return null
    }
    try {
      let formData=new FormData();
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }

      let result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true});
      console.log(result.data);
      dispatch(setMessages([...messages,result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
      setShowPicker(false);
    } catch (error) {
      console.log(`error in sending message in message area ${error}`)
    }
  }


  const onEmojiClick = (emojiData) => {
    setInput( prevInput => prevInput + emojiData.emoji );
  }
  useEffect(()=>{
    socket.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })
    return ()=>socket.off("newMessage")
  },[messages,setMessages])



  const disappearEmoji=()=>{
    setShowPicker(false);
  }



  return (
    <div className={`lg:w-[70%] relative ${selectedUser?"flex":"hidden"} lg:block w-full h-full bg-slate-200 border-l-2 border-gray-300`}>
      {selectedUser && 
      <div className='w-full h-full  flex flex-col'>
      <div className='w-full h-[100px] bg-[#20c7ff] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px] gap-[20px]'>
            
                  <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}>
                    <IoArrowBackOutline className='text-white text-[30px] cursor-pointer' />
                  
                  </div>

            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white'>
                <img src={selectedUser?.image || dp} alt='' className='h-[100%] cursor-pointer'/>
            </div>
            <h1 className='text-gray-700 font-semibold text-[25px]'>{selectedUser?.name || "User"}</h1>
      </div>
         <div className='w-full h-[76vh] lg:h-[71vh] overflow-y-auto flex flex-col px-[20px] py-[10px] gap-[10px] '>
           
          {showPicker && 
          <div className='absolute bottom-[100px] left-[20px] z-10'>
            <EmojiPicker width={300} height={350} reactionsDefaultOpen={true} onEmojiClick={onEmojiClick} />
            </div>}     
        {messages && messages.map((mess)=>(
          mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>:<ReciverMessage image={mess.image} message={mess.message}/>
        ))}
        </div>
      </div>
          
         }
         
    {!selectedUser && 
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <h1 className='text-gray-500 font-bold text-[50px]'>Welcome to Chat karo</h1>
      <span className='text-gray-400 font-semibold text-[30px]'>Let’s Chat</span>
      </div>}
    {selectedUser &&  <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex justify-center items-center '>
      <img src={frontendImage} alt='' className='w-[100px] rounded-lg absolute bottom-[100px] right-[15%] shadow-gray-400 shadow-lg'/>
        <form className='w-[95%] lg:max-w-[80%] h-[60px] bg-[#0eb5e3] rounded-full shadow-gray-400 shadow-lg' onSubmit={handleSendMessage}>
          
          <div className='w-full h-full flex items-center px-[20px] gap-[15px]'>
          <div onClick={()=>setShowPicker(prev=>!prev)}>
            <MdEmojiEmotions className='text-white text-[35px] cursor-pointer'/>
             </div> 
            <input type='text' placeholder='Type a message' className='w-full h-[80%] rounded-full px-[15px] text-white focus:outline-none bg-[#0eb5e3] placeholder:text-white text-[20px]' onChange={(e)=>setInput(e.target.value) } value={input} onClick={disappearEmoji}/>
            <input type='file' accept='image/*' className='hidden' ref={image} onChange={handleImage}/>
              <div onClick={()=>image.current.click()}>
                <FaImages className='text-white text-[30px] cursor-pointer'/>
              </div>
              {(input.length>0 || backendImage!=null) &&  (<button type='submit'>
            <IoSend className='text-white text-[30px] cursor-pointer'/>
            </button> )}
             
          </div>
        </form>
      </div>}
     
</div>
  )
}

export default MessageArea