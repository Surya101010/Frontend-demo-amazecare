import React, { useState } from 'react'
import SidebarIcon from '../Icons/SidebarIcon'

function Sidebar() {
    const [sidebaropen,setSidebaropen]=useState(true)
  return (
    sidebaropen && <div className='absolute h-screen w-80 bg-white ' >
       <div className='p-4 cursor-pointer'onClick={()=>{setSidebaropen(!sidebaropen)}} >
        <SidebarIcon />
        </div> 
    </div>
  )
}

export default Sidebar