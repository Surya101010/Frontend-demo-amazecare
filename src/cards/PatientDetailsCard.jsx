import React from 'react'

function PatientDetailsCard({records}) {
  return (
    <div className='flex gap-2'>{records.map(({ patientId, address, bloodgroup, dob, email, gender,name,phone }) => (
        <div
          key={patientId}
          className="p-4 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <h2 className="text-lg font-bold text-blue-600 mb-2">Patient #{patientId}</h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Bloodgroup:</strong> {bloodgroup}</p>
          <p><strong>Date:</strong> {dob}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Phone :</strong> {phone}</p>
        </div>
      ))}</div>
  )
}

export default PatientDetailsCard
