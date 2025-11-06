import React, { useRef, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../Config'
import GenerateReportsCard from '../../cards/GenerateReportsCard';
import SidebarIcon from '../../Icons/SidebarIcon';
import SideBarButton from '../../components/SideBarButton';
import { useNavigate } from 'react-router';
import Button from '../../components/Button';
import PatientDetailsCard from '../../cards/PatientDetailsCard';
import Input from '../../components/Input';
function AdminPatientDashBoard() {
    const [data,setData] =useState([]);
    const [visible,setVisible]=useState(false);
    const [visible2,setVisible2]=useState(false);
    const nav1=useNavigate();
    const nameRef= useRef();
    const addressRef = useRef()
    const bloodgroupRef = useRef()
    const dobRef = useRef()
    const emailRef = useRef()
    const genderRef = useRef()
    const phoneRef = useRef()
    async function getall(){
        const token = localStorage.getItem("token");
        const response = await axios.get((BACKEND_URL)+"api/patients",{
            headers :{ Authorization: "Bearer "+localStorage.getItem("token")}
        })
        const a = (response.data);
        setData(a);
        console.log(a);
    }

    async function addpatient() {
        const token = localStorage.getItem("token");
         const newPatient = {
            name: nameRef.current.value,
            address: addressRef.current.value,
            bloodgroup: bloodgroupRef.current.value,
            dob: dobRef.current.value,
            email: emailRef.current.value,
            gender: genderRef.current.value,
            phone: phoneRef.current.value,
      }
        const response = await axios.post((BACKEND_URL)+"api/patients",newPatient,{
            headers :{ Authorization: "Bearer "+localStorage.getItem("token")}
        })
    }
  return (
     <div className='flex '>
            <div className='h-screen w-64 border bg-slate-100'>
                <div className='p-4'>
                    <SidebarIcon/>
                </div>
                <div className='m-4'>
                    <SideBarButton text={"Manage Doctors "} onclick={()=>{nav1("/admin/doctors")}} />
                </div>
                <div className='m-4'>
                    <SideBarButton text={"Manage Appointments "} onclick={()=>{nav1("/appointments")}} />
                </div>
                <div className='m-4'>
                    <SideBarButton text={"Generate Reports "} onclick={()=>{nav1("/generateReports")}}/>
                </div>
            </div>
            <div className='pl-4 flex flex-col w-screen pr-12 '>
                <div className='flex justify-center items-center p-4'>
                    <Button text={"get Patient"} onclick={()=>{getall();setVisible(true);setVisible2(false)}} />
                    <Button text={"add patient"} onclick={()=>{setVisible2(true);setVisible(false)}} />
                </div>
                <div>
                    {visible &&<PatientDetailsCard records={data}/>}
                    {visible2 && <div>
                        <div className='flex flex-col p-4 border'>
                           <div className='flex justify-center items-center'>Name: <Input type={'text'} placeholder={"enter name"} reference={nameRef} /></div>
                            <div className='flex justify-center items-center'>Address: <Input type="text" placeholder="Enter address" reference={addressRef} /></div>
                            <div className='flex justify-center items-center'>Blood Group: <Input type="text" placeholder="Enter blood group" reference={bloodgroupRef} /></div>
                            <div className='flex justify-center items-center'>Date of Birth: <Input type="date" placeholder="Enter DOB" reference={dobRef} /></div>
                            <div className='flex justify-center items-center'> Email: <Input type="email" placeholder="Enter email" reference={emailRef} /></div>
                            <div className='flex justify-center items-center'>Gender: <Input type="text" placeholder="Enter gender" reference={genderRef} /></div>
                            <div className='flex justify-center items-center'>Phone: <Input type="number" placeholder="Enter phone" reference={phoneRef} /></div>
                            <Button text="Submit" onclick={addpatient} />
                        </div>
                        </div>}
                </div>
            </div>
        </div>
  )
}

export default AdminPatientDashBoard