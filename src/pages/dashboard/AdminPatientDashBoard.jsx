import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../Config';
import SidebarIcon from '../../Icons/SidebarIcon';
import SideBarButton from '../../components/SideBarButton';
import { useNavigate } from 'react-router';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LogoutButton from '../../components/Logout';
import PatientDetailsCard from '../../cards/PatientDetailsCard';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import UserProfile from "../../components/UserProfile";
import { UserCircle } from "lucide-react";

const patientSchema = z.object({
  name: z.string().min(3, 'Too short').max(50, 'Too long').regex(/^[A-Za-z ]+$/, 'Only letters and spaces allowed'),
  address: z.string().min(5, 'Too short').max(100, 'Too long').regex(/^[A-Za-z0-9 ,.-]+$/, 'Invalid address format'),
  bloodgroup: z.string().regex(/^(A|B|AB|O)[+-]$/, 'Invalid blood group'),
  dob: z.string().refine((val) => {
    const date = new Date(val);
    return date < new Date();
  }, 'Invalid DOB'),
  email: z.string().email('Invalid email').regex(/^\S+@\S+\.\S+$/, 'Email cannot contain spaces'),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Invalid gender' }),
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit number'),
});

function AdminPatientDashBoard() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const userId = localStorage.getItem("userId");
  const nav = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(patientSchema),
  });

  async function getAllPatients() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}api/patients`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setData(res.data);
    } catch {
      alert('Failed to fetch patients');
    }
  }

  const addPatient = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}api/patients`, formData, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert('Patient added successfully');
      await getAllPatients();
      setVisible(true);
      setVisibleAdd(false);
      reset();
    } catch {
      alert('Failed to add patient');
    }
  };

  const updatePatient = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}api/patients/${updateId}`, formData, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert(`Patient #${updateId} updated successfully`);
      await getAllPatients();
      setVisible(true);
      setVisibleUpdate(false);
      reset();
    } catch {
      alert('Failed to update patient');
    }
  };

  const deletePatient = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}api/patients/${deleteId}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      alert(`Patient #${deleteId} deleted successfully`);
      await getAllPatients();
      setVisible(true);
      setVisibleDelete(false);
    } catch {
      alert('Failed to delete patient');
    }
  };

  return (
    <div className="flex">
      <div className="h-screen w-64 border bg-slate-100">
        <div className="p-4">
          <SidebarIcon />
        </div>
        <div className="m-4">
          <SideBarButton text="Manage Doctors" onclick={() => nav('/admin/doctors')} />
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
        <div className="flex justify-center items-center p-4 gap-4">
          <Button text="Get Patients" onclick={() => { getAllPatients(); setVisible(true); setVisibleAdd(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Add Patient" onclick={() => { setVisibleAdd(true); setVisible(false); setVisibleUpdate(false); setVisibleDelete(false); }} />
          <Button text="Update Patient" onclick={() => { setVisibleUpdate(true); setVisible(false); setVisibleAdd(false); setVisibleDelete(false); }} />
          <Button text="Delete Patient" onclick={() => { setVisibleDelete(true); setVisible(false); setVisibleAdd(false); setVisibleUpdate(false); }} />
        </div>

        <div>
          {visible && <PatientDetailsCard records={data} />}

          {visibleAdd && (
            <form onSubmit={handleSubmit(addPatient)} className="flex flex-col p-4 border rounded-xl w-[500px] mx-auto shadow-lg bg-white">
              <h2 className="text-lg font-bold text-blue-600 mb-3 text-center">Add Patient</h2>

              <Input type="text" placeholder="Enter name" {...register('name')} />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

              <Input type="text" placeholder="Enter address" {...register('address')} />
              {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}

              <Input type="text" placeholder="Enter blood group (A+/O-/...)" {...register('bloodgroup')} />
              {errors.bloodgroup && <p className="text-red-600 text-sm">{errors.bloodgroup.message}</p>}

              <Input type="date" placeholder="Enter DOB" {...register('dob')} />
              {errors.dob && <p className="text-red-600 text-sm">{errors.dob.message}</p>}

              <Input type="email" placeholder="Enter email" {...register('email')} />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

              <Input type="text" placeholder="Enter gender (Male/Female/Other)" {...register('gender')} />
              {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}

              <Input type="number" placeholder="Enter phone" {...register('phone')} />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}

              <Button type="submit" text="Submit" />
            </form>
          )}

          {visibleUpdate && (
            <form onSubmit={handleSubmit(updatePatient)} className="flex flex-col p-4 border rounded-xl bg-white w-[500px] mx-auto shadow-xl">
              <h2 className="text-lg font-bold text-green-600 mb-3 text-center">Update Patient</h2>

              <Input type="number" placeholder="Enter Patient ID to update" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
              <Input type="text" placeholder="Enter name" {...register('name')} />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

              <Input type="text" placeholder="Enter address" {...register('address')} />
              {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}

              <Input type="text" placeholder="Enter blood group" {...register('bloodgroup')} />
              {errors.bloodgroup && <p className="text-red-600 text-sm">{errors.bloodgroup.message}</p>}

              <Input type="date" placeholder="Enter DOB" {...register('dob')} />
              {errors.dob && <p className="text-red-600 text-sm">{errors.dob.message}</p>}

              <Input type="email" placeholder="Enter email" {...register('email')} />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

              <Input type="text" placeholder="Enter gender" {...register('gender')} />
              {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}

              <Input type="number" placeholder="Enter phone" {...register('phone')} />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}

              <Button type="submit" text="Update" />
            </form>
          )}

          {visibleDelete && (
            <div className="flex flex-col p-4 border rounded-xl bg-white w-[400px] mx-auto">
              <h2 className="text-lg font-bold text-red-600 mb-3 text-center">Delete Patient</h2>
              <Input type="number" placeholder="Enter Patient ID to delete" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
              <Button text="Delete" onclick={deletePatient} />
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

export default AdminPatientDashBoard;
