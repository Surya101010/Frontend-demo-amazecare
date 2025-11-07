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
import LogoutButton from '../../components/Logout';
function AdminPatientDashBoard() {
    const [data,setData] =useState([]);
    const [visible,setVisible]=useState(false);
    const [visible2,setVisible2]=useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false)
    const [visibleDelete, setVisibleDelete] = useState(false)
    const nav1=useNavigate();
    const idRef = useRef()
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
     async function updatePatient() {
    try {
      const token = localStorage.getItem('token')
      const id = idRef.current.value

      const updatedPatient = {
        name: nameRef.current.value,
        address: addressRef.current.value,
        bloodgroup: bloodgroupRef.current.value,
        dob: dobRef.current.value,
        email: emailRef.current.value,
        gender: genderRef.current.value,
        phone: phoneRef.current.value,
      }

      const response = await axios.put(`${BACKEND_URL}api/patients/${id}`, updatedPatient, {
        headers: { Authorization: 'Bearer ' + token },
      })

      alert(`Patient #${id} updated successfully!`)
      console.log('Updated:', response.data)
      await getall()
      setVisible(true)
      setVisibleUpdate(false)
    } catch (error) {
      console.error('Error updating patient:', error)
      alert('Failed to update patient (check ID or fields)')
    }
  }
  async function deletePatient() {
    try {
      const token = localStorage.getItem('token')
      const id = idRef.current.value

      await axios.delete(`${BACKEND_URL}api/patients/${id}`, {
        headers: { Authorization: 'Bearer ' + token },
      })

      alert(`Patient #${id} deleted successfully!`)
      await getall()
      setVisible(true)
      setVisibleDelete(false)
    } catch (error) {
      console.error('Error deleting patient:', error)
      alert(' Failed to delete patient (check ID)')
    }
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
                <LogoutButton />
            </div>
            <div className='pl-4 flex flex-col w-screen pr-12 '>
                <div className='flex justify-center items-center p-4 gap-4'>
                    <Button text={"get Patient"} onclick={()=>{getall();setVisible(true);setVisible2(false);setVisibleUpdate(false);setVisibleDelete(false)}} />
                    <Button text={"add patient"} onclick={()=>{setVisible2(true);setVisible(false);setVisibleUpdate(false);setVisibleDelete(false)}} />
                    <Button text={"update patient"} onclick={()=>{setVisible(false);setVisible2(false); setVisibleUpdate(true);setVisibleDelete(false) }}   /> 
                    <Button text="Delete Patient" onclick={() => {setVisibleDelete(true);setVisible(false);setVisible2(false);setVisibleUpdate(false)
            }}
          /> 
                </div>
                <div>
                    {visible &&<PatientDetailsCard records={data}/>}
                    {visible2 && <div>
                        <div className='flex flex-col p-4 border rounded-xl w-[500px] mx-auto shadow-lg'>
                            <h2 className='text-lg font-bold text-blue-400 mb-3 text-center'>
                                Add Patient Details
                            </h2>
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
                    {visibleUpdate && (
                        <div className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto shadow-xl">
                        <h2 className="text-lg font-bold text-green-600 mb-3 text-center">
                            Update Patient Details
                        </h2>
                        <Input type="number" placeholder="Enter Patient ID to update" reference={idRef} />
                        <Input type="text" placeholder="Enter name" reference={nameRef} />
                        <Input type="text" placeholder="Enter address" reference={addressRef} />
                        <Input type="text" placeholder="Enter blood group" reference={bloodgroupRef} />
                        <Input type="date" placeholder="Enter DOB" reference={dobRef} />
                        <Input type="email" placeholder="Enter email" reference={emailRef} />
                        <Input type="text" placeholder="Enter gender" reference={genderRef} />
                        <Input type="number" placeholder="Enter phone" reference={phoneRef} />
                        <Button text="Update" onclick={updatePatient} />
                        </div>
                    )}
                    {visibleDelete && (
                        <div className="flex flex-col p-4 border rounded-xl bg-white w-[400px] mx-auto shadow-xl    ">
                        <h2 className="text-lg font-bold text-red-600 mb-3 text-center">
                            Delete Patient Record
                        </h2>
                        <Input type="number" placeholder="Enter Patient ID to delete" reference={idRef} />
                        <Button text="Delete" onclick={deletePatient} />
                        </div>
                     )}
                </div>
            </div>
        </div>
  )
}

export default AdminPatientDashBoard