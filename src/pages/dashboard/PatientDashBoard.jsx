import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../../components/Logout";
import jsPDF from "jspdf"; 
import UserProfile from "../../components/UserProfile";
import { UserCircle } from "lucide-react";

const BACKEND_URL = "http://localhost:8081/api";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [newAppointment, setNewAppointment] = useState({
    doctorId: "",
    date: "",
    symptoms: "",
    visitType: "Consultation",
  });
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [tests, setTests] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };
  useEffect(() => {
    loadPatient();
    loadDoctors();
  }, []);

  async function loadPatient() {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/patients/by-user/${userId}`,
        axiosConfig
      );
      setPatient(res.data);
      loadAppointments(res.data.patientId);
      loadMedicalRecords(res.data.patientId);
    } catch (err) {
      console.error("Error loading patient", err);
    }
  }

  async function loadAppointments(patientId) {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/appointments/patient/${patientId}`,
        axiosConfig
      );
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading appointments", err);
      setAppointments([]);
    }
  }

  async function loadMedicalRecords(patientId) {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/medicalrecords/patient/${patientId}`,
        axiosConfig
      );
      setMedicalRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading records", err);
      setMedicalRecords([]);
    }
  }

  async function loadDoctors() {
    try {
      const res = await axios.get(`${BACKEND_URL}/doctors`, axiosConfig);
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading doctors", err);
      setDoctors([]);
    }
  }

  async function scheduleAppointment(e) {
    e.preventDefault();
    if (!newAppointment.doctorId || !newAppointment.date) {
      alert("Please select doctor and date");
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/appointments`,
        {
          patientId: patient.patientId,
          doctorId: parseInt(newAppointment.doctorId),
          appointmentDate: new Date(newAppointment.date).toISOString(),
          symptoms: newAppointment.symptoms,
          visitType: newAppointment.visitType,
        },
        axiosConfig
      );
      alert("Appointment scheduled successfully!");
      loadAppointments(patient.patientId);
      setNewAppointment({
        doctorId: "",
        date: "",
        symptoms: "",
        visitType: "Consultation",
      });
    } catch (err) {
      console.error("Failed to schedule appointment", err);
      alert("Failed to schedule appointment");
    }
  }

  async function cancelAppointment(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/appointments/${id}`, axiosConfig);
      loadAppointments(patient.patientId);
    } catch (err) {
      console.error("Error cancelling appointment", err);
    }
  }

  async function loadPrescriptions(recordId) {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/prescriptions/record/${recordId}`,
        axiosConfig
      );
      setPrescriptions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading prescriptions", err);
      setPrescriptions([]);
    }
  }

  async function loadTests(recordId) {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/recommendtests/record/${recordId}`,
        axiosConfig
      );
      setTests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading tests", err);
      setTests([]);
    }
  }

  function toggleRecordDetails(recordId) {
    if (expandedRecordId === recordId) {
      setExpandedRecordId(null);
    } else {
      setExpandedRecordId(recordId);
      loadPrescriptions(recordId);
      loadTests(recordId);
    }
  }

  function downloadPDF(record) {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("AmazeCare Medical Report", 70, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Patient ID: ${record.patientId}`, 10, y);
    y += 6;
    doc.text(`Doctor: ${record.doctorName}`, 10, y);
    y += 6;
    doc.text(`Date: ${record.recordDate}`, 10, y);
    y += 8;
    doc.text(`Diagnosis: ${record.diagnosis}`, 10, y);
    y += 6;
    doc.text(`Treatment: ${record.treatment}`, 10, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Prescriptions:", 10, y);
    y += 8;
    if (prescriptions.length > 0) {
      prescriptions.forEach((p) => {
        doc.text(
          `• ${p.medicineName} - ${p.dosage}, ${p.duration} (${p.instructions})`,
          12,
          y
        );
        y += 6;
      });
    } else {
      doc.text("None", 12, y);
      y += 6;
    }

    y += 8;
    doc.text("Recommended Tests:", 10, y);
    y += 8;
    if (tests.length > 0) {
      tests.forEach((t) => {
        doc.text(`• ${t.testName} - ${t.reason} (${t.testDate})`, 12, y);
        y += 6;
      });
    } else {
      doc.text("None", 12, y);
    }

    doc.save(`MedicalRecord_${record.recordId}.pdf`);
  }

  function renderAppointments() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Appointments</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Symptoms</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(appointments) && appointments.length > 0 ? (
              appointments.map((a) => (
                <tr key={a.appointmentId} className="border">
                  <td className="p-2 border">{a.doctorName || "Unknown"}</td>
                  <td className="border">{a.appointmentDate?.split("T")[0]}</td>
                  <td className="border">{a.status}</td>
                  <td className="border">{a.symptoms}</td>
                  <td className="border">
                    {a.status === "Scheduled" && (
                      <button
                        onClick={() => cancelAppointment(a.appointmentId)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-3">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderMedicalHistory() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-3">Medical History</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Date</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(medicalRecords) && medicalRecords.length > 0 ? (
              medicalRecords.map((m) => (
                <>
                  <tr key={m.recordId}>
                    <td className="border p-2">{m.recordDate}</td>
                    <td className="border p-2">{m.doctorName}</td>
                    <td className="border p-2">{m.diagnosis}</td>
                    <td className="border p-2">{m.treatment}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => toggleRecordDetails(m.recordId)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        {expandedRecordId === m.recordId ? "Hide" : "View"}
                      </button>
                      <button
                        onClick={() => downloadPDF(m)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>

                  {expandedRecordId === m.recordId && (
                    <tr>
                      <td colSpan="5" className="bg-gray-50 border p-3">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-blue-700 mb-2">
                              Prescriptions
                            </h3>
                            {prescriptions.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {prescriptions.map((p) => (
                                  <li key={p.prescriptionId}>
                                    <strong>{p.medicineName}</strong> —{" "}
                                    {p.dosage}, {p.duration} ({p.instructions})
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">
                                No prescriptions found.
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold text-blue-700 mb-2">
                              Recommended Tests
                            </h3>
                            {tests.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {tests.map((t) => (
                                  <li key={t.testId}>
                                    <strong>{t.testName}</strong> — {t.reason} (
                                    {t.testDate})
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">
                                No tests recommended.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-3">
                  No medical records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderNewAppointmentForm() {
    return (
      <form onSubmit={scheduleAppointment} className="mt-4 space-y-3 pt-5">
        <select
          value={newAppointment.doctorId}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, doctorId: e.target.value })
          }
          className="border p-2 w-full rounded"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.doctorId} value={d.doctorId}>
              {d.name} ({d.specialization || "General"})
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={newAppointment.date}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, date: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          placeholder="Symptoms"
          value={newAppointment.symptoms}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, symptoms: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </form>
    );
  }

  if (!patient) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-blue-700">
            Patient Dashboard
          </h2>
          <button
            onClick={() => setActiveTab("appointments")}
            className="block w-full mb-2 hover:bg-gray-300 p-2 rounded"
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("medicalHistory")}
            className="block w-full mb-2 hover:bg-gray-300 p-2 rounded"
          >
            Medical History
          </button>
          <button
            onClick={() => setActiveTab("newAppointment")}
            className="block w-full mb-2 hover:bg-gray-300 p-2 rounded"
          >
            Book Appointment
          </button>
        </div>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeTab === "appointments" && renderAppointments()}
        {activeTab === "medicalHistory" && renderMedicalHistory()}
        {activeTab === "newAppointment" && renderNewAppointmentForm()}
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
