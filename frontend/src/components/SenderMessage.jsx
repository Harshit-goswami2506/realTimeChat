import React, { useEffect, useRef } from 'react'
import dp from '../assets/dp.jpg'
import { useSelector } from 'react-redux';
function SenderMessage({ image, message }) {

  let scroll=useRef()
  let {userData}=useSelector((state)=>state.user);
   useEffect(()=>{
      scroll.current.scrollIntoView({behavior:"smooth"})
    },[message,image])
    const handleImageScroll=()=>{
    scroll.current.scrollIntoView({behavior:"smooth"})
  }
  return (
    <div className='w-fit max-w-[500px] px-[20px] py-[5px] bg-[#0eb5e3] text-white text-[19px] rounded-tr-none rounded-3xl shadow-gray-400 shadow-lg gap-[10px] relative mb-[10px] ml-auto flex flex-col' ref={scroll}>

       <div className='w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white absolute top-[-10px] right-[-10px]'>
                          <img src={userData.image || dp} alt='' className='h-[100%]'/>
                      </div>
        {image && <img src={image} alt='' className='w-[150px] rounded-lg' onLoad={handleImageScroll}/>}
        {message && <span >{message}</span>}
    </div>
  )
}

export default SenderMessage