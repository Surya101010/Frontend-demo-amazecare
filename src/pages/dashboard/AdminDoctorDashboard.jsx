import React, { useRef, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../Config'
import SidebarIcon from '../../Icons/SidebarIcon'
import SideBarButton from '../../components/SideBarButton'
import { useNavigate } from 'react-router'
import Button from '../../components/Button'
import Input from '../../components/Input'

function AdminDoctorDashboard() {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const nav = useNavigate()

  // Refs
  const idRef = useRef()
  const nameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()
  const specializationRef = useRef()
  const availabilityRef = useRef()

  // ✅ Get all doctors
  async function getAllDoctors() {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BACKEND_URL}api/doctors`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      setData(res.data)
    } catch (err) {
      console.error('Error fetching doctors:', err)
      alert('❌ Failed to fetch doctors')
    }
  }

  // ✅ Add doctor
  async function addDoctor() {
    try {
      const token = localStorage.getItem('token')
      const newDoctor = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        specialization: specializationRef.current.value,
        availabilitystatus: availabilityRef.current.value,
      }

      await axios.post(`${BACKEND_URL}api/doctors`, newDoctor, {
        headers: { Authorization: 'Bearer ' + token },
      })

      alert('✅ Doctor added successfully!')
      await getAllDoctors()
      setVisible(true)
      setVisibleAdd(false)
    } catch (err) {
      console.error('Error adding doctor:', err)
      alert('❌ Failed to add doctor')
    }
  }

  // ✅ Update doctor
  async function updateDoctor() {
    try {
      const token = localStorage.getItem('token')
      const id = idRef.current.value

      const updatedDoctor = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        specialization: specializationRef.current.value,
        availabilitystatus: availabilityRef.current.value,
      }

      await axios.put(`${BACKEND_URL}api/doctors/${id}`, updatedDoctor, {
        headers: { Authorization: 'Bearer ' + token },
      })

      alert(`✅ Doctor #${id} updated successfully!`)
      await getAllDoctors()
      setVisible(true)
      setVisibleUpdate(false)
    } catch (err) {
      console.error('Error updating doctor:', err)
      alert('❌ Failed to update doctor')
    }
  }

  // ✅ Delete doctor
  async function deleteDoctor() {
    try {
      const token = localStorage.getItem('token')
      const id = idRef.current.value
      await axios.delete(`${BACKEND_URL}api/doctors/${id}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      alert(`🗑️ Doctor #${id} deleted successfully!`)
      await getAllDoctors()
      setVisible(true)
      setVisibleDelete(false)
    } catch (err) {
      console.error('Error deleting doctor:', err)
      alert('❌ Failed to delete doctor')
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-screen w-64 border bg-slate-100">
        <div className="p-4">
          <SidebarIcon />
        </div>
        <div className="m-4">
          <SideBarButton text="Manage Patients" onclick={() => nav('/admin/patients')} />
        </div>
        <div className="m-4">
          <SideBarButton text="Manage Appointments" onclick={() => nav('/appointments')} />
        </div>
        <div className="m-4">
          <SideBarButton text="Generate Reports" onclick={() => nav('/generateReports')} />
        </div>
      </div>

      {/* Main Section */}
      <div className="pl-4 flex flex-col w-screen pr-12">
        <div className="flex justify-center items-center gap-4 p-4">
          <Button
            text="Get Doctors"
            onclick={() => {
              getAllDoctors()
              setVisible(true)
              setVisibleAdd(false)
              setVisibleUpdate(false)
              setVisibleDelete(false)
            }}
          />
          <Button
            text="Add Doctor"
            onclick={() => {
              setVisibleAdd(true)
              setVisible(false)
              setVisibleUpdate(false)
              setVisibleDelete(false)
            }}
          />
          <Button
            text="Update Doctor"
            onclick={() => {
              setVisibleUpdate(true)
              setVisible(false)
              setVisibleAdd(false)
              setVisibleDelete(false)
            }}
          />
          <Button
            text="Delete Doctor"
            onclick={() => {
              setVisibleDelete(true)
              setVisible(false)
              setVisibleAdd(false)
              setVisibleUpdate(false)
            }}
          />
        </div>

        <div>
          {/* Doctor List */}
          {visible && (
            <div className="grid grid-cols-3 gap-4 p-4">
              {data.map((d) => (
                <div key={d.doctorId} className="border p-4 rounded-lg bg-white shadow-md">
                  <h2 className="text-blue-600 font-bold text-lg mb-2">
                    {d.name} ({d.specialization})
                  </h2>
                  <p><b>Email:</b> {d.email}</p>
                  <p><b>Phone:</b> {d.phone}</p>
                  <p><b>Status:</b> {d.availabilitystatus}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Doctor */}
          {visibleAdd && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto">
              <h2 className="text-lg font-bold text-blue-600 mb-3 text-center">Add Doctor</h2>
              <Input type="text" placeholder="Enter name" reference={nameRef} />
              <Input type="email" placeholder="Enter email" reference={emailRef} />
              <Input type="number" placeholder="Enter phone" reference={phoneRef} />
              <Input type="text" placeholder="Enter specialization" reference={specializationRef} />
              <Input type="text" placeholder="Availability (Available/Unavailable)" reference={availabilityRef} />
              <Button text="Submit" onclick={addDoctor} />
            </div>
          )}

          {/* Update Doctor */}
          {visibleUpdate && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto">
              <h2 className="text-lg font-bold text-green-600 mb-3 text-center">Update Doctor</h2>
              <Input type="number" placeholder="Enter Doctor ID to update" reference={idRef} />
              <Input type="text" placeholder="Enter name" reference={nameRef} />
              <Input type="email" placeholder="Enter email" reference={emailRef} />
              <Input type="number" placeholder="Enter phone" reference={phoneRef} />
              <Input type="text" placeholder="Enter specialization" reference={specializationRef} />
              <Input type="text" placeholder="Availability (Available/Unavailable)" reference={availabilityRef} />
              <Button text="Update" onclick={updateDoctor} />
            </div>
          )}

          
          {visibleDelete && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[400px] mx-auto">
              <h2 className="text-lg font-bold text-red-600 mb-3 text-center">Delete Doctor</h2>
              <Input type="number" placeholder="Enter Doctor ID to delete" reference={idRef} />
              <Button text="Delete" onclick={deleteDoctor} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDoctorDashboard
