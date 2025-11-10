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
import { UserCircle } from "lucide-react";
import UserProfile from '../../components/UserProfile';

const doctorSchema = z.object({
  name: z
    .string()
    .min(3, 'Too short')
    .max(50, 'Too long')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces allowed'),
  email: z
    .string()
    .email('Invalid email')
    .regex(/^\S+@\S+\.\S+$/, 'Email cannot contain spaces'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Must be a 10-digit number'),
  specialization: z
    .string()
    .min(3, 'Too short')
    .max(50, 'Too long')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces allowed'),
  availabilitystatus: z
    .string()
    .refine((val) => ['Available', 'Unavailable'].includes(val), 'Must be Available or Unavailable'),
});

function AdminDoctorDashboard() {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorSchema),
  });

  async function getAllDoctors() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}api/doctors`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setData(res.data);
    } catch {
      alert('Failed to fetch doctors');
    }
  }

  const addDoctor = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}api/doctors`, formData, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert('Doctor added successfully');
      await getAllDoctors();
      setVisible(true);
      setVisibleAdd(false);
      reset();
    } catch {
      alert('Failed to add doctor');
    }
  };

  const updateDoctor = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}api/doctors/${updateId}`, formData, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert(`Doctor #${updateId} updated successfully`);
      await getAllDoctors();
      setVisible(true);
      setVisibleUpdate(false);
      reset();
    } catch {
      alert('Failed to update doctor');
    }
  };

  async function deleteDoctor() {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}api/doctors/${deleteId}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert(`Doctor #${deleteId} deleted successfully`);
      await getAllDoctors();
      setVisible(true);
      setVisibleDelete(false);
    } catch {
      alert('Failed to delete doctor');
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
          <SideBarButton text="Manage Appointments" onclick={() => nav('/appointments')} />
        </div>
        <div className="m-4">
          <SideBarButton text="Generate Reports" onclick={() => nav('/generateReports')} />
        </div>
        <LogoutButton />
      </div>

      <div className="pl-4 flex flex-col w-screen pr-12">
        <div className="flex justify-center items-center gap-4 p-4">
          <Button text="Get Doctors" onclick={() => { getAllDoctors(); setVisible(true); setVisibleAdd(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Add Doctor" onclick={() => { setVisibleAdd(true); setVisible(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Update Doctor" onclick={() => { setVisibleUpdate(true); setVisible(false); setVisibleAdd(false); setVisibleDelete(false); }} />
          <Button text="Delete Doctor" onclick={() => { setVisibleDelete(true); setVisible(false); setVisibleAdd(false); setVisibleUpdate(false); }} />
        </div>

        <div>
          {visible && (
            <div className="grid grid-cols-3 gap-4 p-4">
              {data.map((d) => (
                <div key={d.doctorId} className="border p-4 rounded-lg bg-white shadow-md">
                  <h2 className="text-blue-600 font-bold text-lg mb-2">{d.name} ({d.specialization})</h2>
                  <p><b>Email:</b> {d.email}</p>
                  <p><b>Phone:</b> {d.phone}</p>
                  <p><b>Status:</b> {d.availabilitystatus}</p>
                </div>
              ))}
            </div>
          )}

          {visibleAdd && (
            <form onSubmit={handleSubmit(addDoctor)} className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto">
              <h2 className="text-lg font-bold text-blue-600 mb-3 text-center">Add Doctor</h2>

              <Input type="text" placeholder="Enter name" {...register('name')} />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

              <Input type="email" placeholder="Enter email" {...register('email')} />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

              <Input type="number" placeholder="Enter phone" {...register('phone')} />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}

              <Input type="text" placeholder="Enter specialization" {...register('specialization')} />
              {errors.specialization && <p className="text-red-600 text-sm">{errors.specialization.message}</p>}

              <Input type="text" placeholder="Availability (Available/Unavailable)" {...register('availabilitystatus')} />
              {errors.availabilitystatus && <p className="text-red-600 text-sm">{errors.availabilitystatus.message}</p>}

              <Button type="submit" text="Submit" />
            </form>
          )}

          {visibleUpdate && (
            <form onSubmit={handleSubmit(updateDoctor)} className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto">
              <h2 className="text-lg font-bold text-green-600 mb-3 text-center">Update Doctor</h2>

              <Input type="number" placeholder="Enter Doctor ID to update" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
              <Input type="text" placeholder="Enter name" {...register('name')} />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

              <Input type="email" placeholder="Enter email" {...register('email')} />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

              <Input type="number" placeholder="Enter phone" {...register('phone')} />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}

              <Input type="text" placeholder="Enter specialization" {...register('specialization')} />
              {errors.specialization && <p className="text-red-600 text-sm">{errors.specialization.message}</p>}

              <Input type="text" placeholder="Availability (Available/Unavailable)" {...register('availabilitystatus')} />
              {errors.availabilitystatus && <p className="text-red-600 text-sm">{errors.availabilitystatus.message}</p>}

              <Button type="submit" text="Update" />
            </form>
          )}

          {visibleDelete && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[400px] mx-auto">
              <h2 className="text-lg font-bold text-red-600 mb-3 text-center">Delete Doctor</h2>
              <Input type="number" placeholder="Enter Doctor ID to delete" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
              <Button text="Delete" onclick={deleteDoctor} />
            </div>
          )}
        </div>
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

export default AdminDoctorDashboard;
