import React, { useRef, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../Config'
import SidebarIcon from '../../Icons/SidebarIcon'
import SideBarButton from '../../components/SideBarButton'
import { useNavigate } from 'react-router'
import Button from '../../components/Button'
import Input from '../../components/Input'

function AppointmentDashboard() {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const nav = useNavigate()

  const idRef = useRef()
  const doctorIdRef = useRef()
  const patientIdRef = useRef()
  const dateRef = useRef()
  const statusRef = useRef()
  const symptomsRef = useRef()
  const visitTypeRef = useRef()

  async function getAllAppointments() {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${BACKEND_URL}api/appointments`, {
      headers: { Authorization: 'Bearer ' + token },
    })
    setData(res.data)
  }

  async function addAppointment() {
  try {
    const token = localStorage.getItem('token')
    const rawDate = dateRef.current.value
    const formattedDate = rawDate.replace('T', ' ') + ':00' // ✅ Convert format

    const newAppointment = {
      doctorId: parseInt(doctorIdRef.current.value),
      patientId: parseInt(patientIdRef.current.value),
      appointmentDate: formattedDate,
      status: statusRef.current.value,
      symptoms: symptomsRef.current.value,
      visitType: visitTypeRef.current.value,
    }

    console.log('Sending appointment payload:', newAppointment)

    const response = await axios.post(`${BACKEND_URL}api/appointments`, newAppointment, {
      headers: { Authorization: 'Bearer ' + token },
    })

    alert('✅ Appointment added successfully!')
    console.log('Response:', response.data)
    getAllAppointments()
    setVisible(true)
    setVisibleAdd(false)
  } catch (error) {
    console.error('❌ Error adding appointment:', error.response || error)
    alert('Failed to add appointment (check backend logs for details)')
  }
}


async function updateAppointment() {
  try {
    const token = localStorage.getItem('token')
    const id = idRef.current.value

    // ✅ Fix the date format
    const rawDate = dateRef.current.value // example: "2025-08-21T04:30"
    const formattedDate = rawDate.replace('T', ' ') + ':00' // now "2025-08-21 04:30:00"

    // ✅ Prepare updated payload
    const updated = {
      doctorId: parseInt(doctorIdRef.current.value),
      patientId: parseInt(patientIdRef.current.value),
      appointmentDate: formattedDate,
      status: statusRef.current.value,
      symptoms: symptomsRef.current.value,
      visitType: visitTypeRef.current.value,
    }

    console.log('📤 Sending Update Payload:', updated)

    // ✅ Send PUT request
    const res = await axios.put(`${BACKEND_URL}api/appointments/${id}`, updated, {
      headers: { Authorization: 'Bearer ' + token },
    })

    alert(`✅ Appointment #${id} updated successfully!`)
    console.log('Response:', res.data)

    // ✅ Refresh and reset
    await getAllAppointments()
    setVisible(true)
    setVisibleUpdate(false)
  } catch (error) {
    console.error('❌ Error updating appointment:', error.response?.data || error)
    alert('Failed to update appointment (check backend logs for details).')
  }
}


  async function deleteAppointment() {
    const token = localStorage.getItem('token')
    const id = idRef.current.value
    await axios.delete(`${BACKEND_URL}api/appointments/${id}`, {
      headers: { Authorization: 'Bearer ' + token },
    })
    alert(`🗑️ Appointment #${id} deleted`)
    getAllAppointments()
    setVisible(true)
    setVisibleDelete(false)
  }

  return (
    <div className="flex">
      <div className="h-screen w-64 border bg-slate-100">
        <div className="p-4">
          <SidebarIcon />
        </div>
        <div className="m-4">
          <SideBarButton text="Manage Patients" onclick={() => nav('/admin/patients')} />
        </div>
        <div className="m-4">
          <SideBarButton text="Manage Doctors" onclick={() => nav('/admin/doctors')} />
        </div>
        <div className="m-4">
          <SideBarButton text="Generate Reports" onclick={() => nav('/generateReports')} />
        </div>
      </div>

      <div className="pl-4 flex flex-col w-screen pr-12">
        <div className="flex justify-center items-center gap-4 p-4">
          <Button text="Get Appointments" onclick={() => { getAllAppointments(); setVisible(true); setVisibleAdd(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Add Appointment" onclick={() => { setVisibleAdd(true); setVisible(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Update Appointment" onclick={() => { setVisibleUpdate(true); setVisible(false); setVisibleAdd(false); setVisibleDelete(false); }} />
          <Button text="Delete Appointment" onclick={() => { setVisibleDelete(true); setVisible(false); setVisibleAdd(false); setVisibleUpdate(false); }} />
        </div>

        <div>
          {visible && (
            <div className="grid grid-cols-3 gap-4 p-4">
              {data.map((a) => (
                <div key={a.appointmentId} className="border p-4 rounded-lg bg-white shadow-md">
                  <h2 className="text-blue-600 font-bold mb-2">Appointment #{a.appointmentId}</h2>
                  <p><b>Patient ID:</b> {a.patientId}</p>
                  <p><b>Doctor ID:</b> {a.doctorId}</p>
                  <p><b>Date:</b> {a.appointmentDate}</p>
                  <p><b>Status:</b> {a.status}</p>
                  <p><b>Symptoms:</b> {a.symptoms}</p>
                  <p><b>Visit Type:</b> {a.visitType}</p>
                </div>
              ))}
            </div>
          )}

          {visibleAdd && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto">
              <h2 className="text-lg font-bold text-blue-600 mb-3 text-center">Add Appointment</h2>
              <Input type="number" placeholder="Enter Doctor ID" reference={doctorIdRef} />
              <Input type="number" placeholder="Enter Patient ID" reference={patientIdRef} />
              <Input type="datetime-local" placeholder="Enter Appointment Date" reference={dateRef} />
              <Input type="text" placeholder="Enter Status" reference={statusRef} />
              <Input type="text" placeholder="Enter Symptoms" reference={symptomsRef} />
              <Input type="text" placeholder="Enter Visit Type" reference={visitTypeRef} />
              <Button text="Submit" onclick={addAppointment} />
            </div>
          )}

          {visibleUpdate && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto">
              <h2 className="text-lg font-bold text-green-600 mb-3 text-center">Update Appointment</h2>
              <Input type="number" placeholder="Enter Appointment ID" reference={idRef} />
              <Input type="number" placeholder="Enter Doctor ID" reference={doctorIdRef} />
              <Input type="number" placeholder="Enter Patient ID" reference={patientIdRef} />
              <Input type="datetime-local" placeholder="Enter Appointment Date" reference={dateRef} />
              <Input type="text" placeholder="Enter Status" reference={statusRef} />
              <Input type="text" placeholder="Enter Symptoms" reference={symptomsRef} />
              <Input type="text" placeholder="Enter Visit Type" reference={visitTypeRef} />
              <Button text="Update" onclick={updateAppointment} />
            </div>
          )}

          {visibleDelete && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[400px] mx-auto">
              <h2 className="text-lg font-bold text-red-600 mb-3 text-center">Delete Appointment</h2>
              <Input type="number" placeholder="Enter Appointment ID to delete" reference={idRef} />
              <Button text="Delete" onclick={deleteAppointment} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentDashboard
