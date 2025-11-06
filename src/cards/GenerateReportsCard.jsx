import React from 'react'

function GenerateReportsCard({records}) {
  return (
    <div className='flex gap-2'>{records.map(({ recordId, diagnosis, treatment, recordDate, doctorId, patientId }) => (
        <div
          key={recordId}
          className="p-4 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <h2 className="text-lg font-bold text-blue-600 mb-2">Report #{recordId}</h2>
          <p><strong>Diagnosis:</strong> {diagnosis}</p>
          <p><strong>Treatment:</strong> {treatment}</p>
          <p><strong>Date:</strong> {recordDate}</p>
          <p><strong>Doctor ID:</strong> {doctorId}</p>
          <p><strong>Patient ID:</strong> {patientId}</p>
        </div>
      ))}</div>
  )
}

export default GenerateReportsCard  