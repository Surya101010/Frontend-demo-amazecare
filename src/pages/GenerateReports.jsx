import React, { useRef, useState } from 'react'
import Button from '../components/Button'
import axios from 'axios'
import { BACKEND_URL } from '../Config'
import GenerateReportsCard from '../cards/GenerateReportsCard';
import SidebarIcon from '../Icons/SidebarIcon';
import SideBarButton from '../components/SideBarButton';
import { useNavigate } from 'react-router';

function GenerateReports() {
    const [data,setData] =useState([]);
    const nav1=useNavigate();
    async function generate(){
        const token = localStorage.getItem("token");
        const response = await axios.get((BACKEND_URL)+"api/medicalrecords",{
            headers :{ Authorization: "Bearer "+localStorage.getItem("token")}
        })
        const a = (response.data);
        setData(a);
        console.log(a);
    }
    return (
        <div className='flex '>
            <div className='h-screen w-64 border bg-slate-100'>
                <div className='p-4'>
                    <SidebarIcon/>
                </div>
                <div className='m-4'>
                    <SideBarButton text={"Manage Patients "} onclick={()=>{nav1("/admin/patients")}}/>
                </div>
                <div className='m-4'>
                    <SideBarButton text={"Manage Doctors "} onclick={()=>{nav1("/admin/doctors")}} />
                </div>
                <div className='m-4'>
                    <SideBarButton text={"Manage Appointments "} onclick={()=>{nav1("/appointments")}} />
                </div>
            </div>
            <div className='pl-4 flex flex-col '>
                <div className='flex justify-center items-center p-4'>
                    <Button text={"Generate reports"} onclick={generate} />
                </div>
                <GenerateReportsCard records={data} />
            </div>
        </div>
    
  )
}

export default GenerateReports