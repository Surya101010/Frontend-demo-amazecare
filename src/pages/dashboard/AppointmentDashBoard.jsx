import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../Config';
import SidebarIcon from '../../Icons/SidebarIcon';
import SideBarButton from '../../components/SideBarButton';
import { useNavigate } from 'react-router';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LogoutButton from '../../components/Logout';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import UserProfile from '../../components/UserProfile';
import { UserCircle } from "lucide-react";

const appointmentSchema = z.object({
  doctorId: z.number().int().positive('Invalid Doctor ID'),
  patientId: z.number().int().positive('Invalid Patient ID'),
  appointmentDate: z.string().nonempty('Select a date and time').refine(
    (val) => {
      const date = new Date(val);
      return date >= new Date();
    },
    { message: 'Date cannot be in the past' }
  ),
  status: z.string().min(3, 'Too short').regex(/^[A-Za-z ]+$/, 'Letters only'),
  symptoms: z.string().min(3, 'Too short').regex(/^[A-Za-z ,]+$/, 'Letters or commas only'),
  visitType: z.string().min(3, 'Too short').regex(/^[A-Za-z ]+$/, 'Letters only'),
});

function AppointmentDashboard() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const userId = localStorage.getItem("userId");
  const nav = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(appointmentSchema),
  });

  async function getAllAppointments() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${BACKEND_URL}api/appointments`, {
      headers: { Authorization: 'Bearer ' + token },
    });
    setData(res.data);
  }

  const addAppointment = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const formattedDate = new Date(formData.appointmentDate).toISOString();
      const newAppointment = { ...formData, appointmentDate: formattedDate };
      await axios.post(`${BACKEND_URL}api/appointments`, newAppointment, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert('Appointment added successfully');
      getAllAppointments();
      setVisible(true);
      setVisibleAdd(false);
      reset();
    } catch {
      alert('Failed to add appointment');
    }
  };

  const updateAppointment = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const formattedDate = new Date(formData.appointmentDate).toISOString();
      const updated = { ...formData, appointmentDate: formattedDate };
      await axios.put(`${BACKEND_URL}api/appointments/${updateId}`, updated, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert(`Appointment #${updateId} updated successfully`);
      await getAllAppointments();
      setVisible(true);
      setVisibleUpdate(false);
      reset();
    } catch {
      alert('Failed to update appointment');
    }
  };

  async function deleteAppointment() {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}api/appointments/${deleteId}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert(`Appointment #${deleteId} deleted`);
      getAllAppointments();
      setVisible(true);
      setVisibleDelete(false);
    } catch {
      alert('Error deleting appointment');
    }
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
        <LogoutButton />
      </div>

      <div className="pl-4 flex flex-col w-screen pr-12">
        <div className="flex justify-center items-center gap-4 p-4">
          <Button text="Get Appointments" onclick={() => { getAllAppointments(); setVisible(true); setVisibleAdd(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Add Appointment" onclick={() => { setVisibleAdd(true); setVisible(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Update Appointment" onclick={() => { setVisibleUpdate(true); setVisible(false); setVisibleAdd(false); setVisibleDelete(false); }} />
          <Button text="Delete Appointment" onclick={() => { setVisibleDelete(true); setVisible(false); setVisibleAdd(false); setVisibleUpdate(false); }} />
        </div>

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
          <form
            onSubmit={handleSubmit(addAppointment)}
            className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto"
          >
            <h2 className="text-lg font-bold text-blue-600 mb-3 text-center">Add Appointment</h2>
            <Input type="number" placeholder="Enter Doctor ID" {...register("doctorId", { valueAsNumber: true })} />
            {errors.doctorId && <p className="text-red-600 text-sm">{errors.doctorId.message}</p>}

            <Input type="number" placeholder="Enter Patient ID" {...register("patientId", { valueAsNumber: true })} />
            {errors.patientId && <p className="text-red-600 text-sm">{errors.patientId.message}</p>}

            <Input type="datetime-local" {...register("appointmentDate")} />
            {errors.appointmentDate && <p className="text-red-600 text-sm">{errors.appointmentDate.message}</p>}

            <Input type="text" placeholder="Enter Status" {...register("status")} />
            {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}

            <Input type="text" placeholder="Enter Symptoms" {...register("symptoms")} />
            {errors.symptoms && <p className="text-red-600 text-sm">{errors.symptoms.message}</p>}

            <Input type="text" placeholder="Enter Visit Type" {...register("visitType")} />
            {errors.visitType && <p className="text-red-600 text-sm">{errors.visitType.message}</p>}

            <Button type="submit" text="Submit" />
          </form>
        )}

        {visibleUpdate && (
          <form
            onSubmit={handleSubmit(updateAppointment)}
            className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto"
          >
            <h2 className="text-lg font-bold text-green-600 mb-3 text-center">Update Appointment</h2>
            <Input type="number" placeholder="Enter Appointment ID" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
            <Input type="number" placeholder="Enter Doctor ID" {...register("doctorId", { valueAsNumber: true })} />
            {errors.doctorId && <p className="text-red-600 text-sm">{errors.doctorId.message}</p>}

            <Input type="number" placeholder="Enter Patient ID" {...register("patientId", { valueAsNumber: true })} />
            {errors.patientId && <p className="text-red-600 text-sm">{errors.patientId.message}</p>}

            <Input type="datetime-local" {...register("appointmentDate")} />
            {errors.appointmentDate && <p className="text-red-600 text-sm">{errors.appointmentDate.message}</p>}

            <Input type="text" placeholder="Enter Status" {...register("status")} />
            {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}

            <Input type="text" placeholder="Enter Symptoms" {...register("symptoms")} />
            {errors.symptoms && <p className="text-red-600 text-sm">{errors.symptoms.message}</p>}

            <Input type="text" placeholder="Enter Visit Type" {...register("visitType")} />
            {errors.visitType && <p className="text-red-600 text-sm">{errors.visitType.message}</p>}

            <Button type="submit" text="Update" />
          </form>
        )}

        {visibleDelete && (
          <div className="flex flex-col p-4 border rounded-xl bg-white w-[400px] mx-auto">
            <h2 className="text-lg font-bold text-red-600 mb-3 text-center">Delete Appointment</h2>
            <Input
              type="number"
              placeholder="Enter Appointment ID to delete"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <Button text="Delete" onclick={deleteAppointment} />
          </div>
        )}
      </div>
      <div className="relative">
            <div className="absolute top-4 right-6 cursor-pointer">
              <UserCircle
                size={36}
                className="text-blue-600 hover:text-blue-800 transition-all"
                onClick={() => setShowProfile(true)}
              />
            </div>
      
            {showProfile && (
              <UserProfile userId={userId} onClose={() => setShowProfile(false)} />
            )}
          </div>
    </div>
  );
}

export default AppointmentDashboard;
