import React from 'react'
import Button from '../../components/Button'
import { useNavigate } from 'react-router'

function AdminDashboard() { 
  const nav =useNavigate();
  return (

    <div className='h-screen  flex justify-center items-center bg-black text-white w-[-110px] flex-col'>
      <div className='text-4xl border border-3 p-4 box-border shadow-md shadow-orange-600'>ADMIN DASHBORAD</div>
        <div className=' gap-2 border border-slate-50 rounded p-16 m-8 shadow-md shadow-purple-600'>
          <div className='text-black flex gap-2 pb-4'>
            <Button text={"Manage Patients"} onclick={()=>{}} /> 
            <Button text={"Manage Doctors"}/>
          </div>
          <div className='text-black flex gap-2'>
            <Button text={"Manage Appointments"} />
            <Button text={"Generate Reports"} onclick={()=>{nav("/generateReports")}}/>
          </div>
        
        </div>
    </div>
  )
}

export default AdminDashboard