import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'

import getMessage from '../customHooks/getMessage';
import { useSelector } from 'react-redux';


function Home() {
 let {selectedUser}=useSelector(state=>state.user)
  getMessage();
  return (
    <div className='flex w-full h-[100vh] overflow-hidden'>
      <SideBar/>
      <MessageArea/>
      
    </div>
  )
}

export default Home