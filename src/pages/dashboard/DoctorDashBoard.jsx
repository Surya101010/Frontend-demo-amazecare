import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile";
import { UserCircle } from "lucide-react";
export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prescription, setPrescription] = useState({ medicineName: "", dosage: "", duration: "", instructions: "" });
  const [test, setTest] = useState({ testName: "", reason: "", testDate: "" });
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [testsList, setTestsList] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const userId = localStorage.getItem("userId");

  const doctorId = localStorage.getItem("doctorId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    loadDoctor();
    loadAppointments();
    loadRecords();
  }, []);

  async function loadDoctor() {
    const res = await axios.get(`http://localhost:8081/api/doctors/${doctorId}`, axiosConfig);
    setDoctor(res.data);
  }

  async function loadAppointments() {
    const res = await axios.get(`http://localhost:8081/api/appointments/doctor/${doctorId}`, axiosConfig);
    setAppointments(res.data);
  }

  async function loadRecords() {
    const res = await axios.get(`http://localhost:8081/api/doctors/${doctorId}/records`, axiosConfig);
    setRecords(res.data || []);
  }

  async function updateAppointmentStatus(id, status) {
    await axios.put(`http://localhost:8081/api/appointments/${id}/status?status=${status}`, {}, axiosConfig);
    alert(`Appointment marked as ${status}`);
    await loadAppointments();
    await loadRecords();
  }

  async function openConsultation(a) {
    const res = await axios.get(`http://localhost:8081/api/medicalrecords/patient/${a.patientId}`, axiosConfig);
    const rec = res.data.find((r) => r.doctorId === parseInt(doctorId));
    if (rec) {
      setSelectedRecord(rec);
      setShowModal(true);
      await fetchPrescriptions(rec.recordId);
      await fetchTests(rec.recordId);
    } else {
      alert("No record found for this appointment yet.");
    }
  }

  async function fetchPrescriptions(recordId) {
    const res = await axios.get(`http://localhost:8081/api/prescriptions/record/${recordId}`, axiosConfig);
    setPrescriptionsList(res.data || []);
  }

  async function fetchTests(recordId) {
    const res = await axios.get(`http://localhost:8081/api/recommendtests/record/${recordId}`, axiosConfig);
    setTestsList(res.data || []);
  }

  async function addPrescription() {
    await axios.post(
      `http://localhost:8081/api/prescriptions`,
      { recordId: selectedRecord.recordId, ...prescription },
      axiosConfig
    );
    alert("Prescription added");
    setPrescription({ medicineName: "", dosage: "", duration: "", instructions: "" });
    await fetchPrescriptions(selectedRecord.recordId);
  }

  async function addTest() {
    await axios.post(
      `http://localhost:8081/api/recommendtests`,
      { recordId: selectedRecord.recordId, ...test },
      axiosConfig
    );
    alert("Test recommendation added");
    setTest({ testName: "", reason: "", testDate: "" });
    await fetchTests(selectedRecord.recordId);
  }

  async function deletePrescription(id) {
    if (!window.confirm("Delete this prescription?")) return;
    await axios.delete(`http://localhost:8081/api/prescriptions/${id}`, axiosConfig);
    alert("Prescription deleted");
    await fetchPrescriptions(selectedRecord.recordId);
  }

  async function deleteTest(id) {
    if (!window.confirm("Delete this test?")) return;
    await axios.delete(`http://localhost:8081/api/recommendtests/${id}`, axiosConfig);
    alert("Test deleted");
    await fetchTests(selectedRecord.recordId);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/", { replace: true });
  }

  function renderConsultationModal() {
    if (!selectedRecord) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Consultation Details</h3>

          <input
            type="text"
            placeholder="Diagnosis"
            value={selectedRecord.diagnosis || ""}
            onChange={(e) => setSelectedRecord({ ...selectedRecord, diagnosis: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Treatment"
            value={selectedRecord.treatment || ""}
            onChange={(e) => setSelectedRecord({ ...selectedRecord, treatment: e.target.value })}
            className="border p-2 mb-4 w-full rounded"
          />

          <h4 className="text-md font-semibold mb-2 text-gray-700">Prescriptions</h4>
          <ul className="mb-3 border p-2 rounded bg-gray-50">
            {prescriptionsList.length === 0 && <li className="text-sm text-gray-500">No prescriptions yet.</li>}
            {prescriptionsList.map((p) => (
              <li key={p.prescriptionId} className="text-sm mb-1 flex justify-between items-center">
                <span>
                  {p.medicineName} ({p.dosage}, {p.duration}) – {p.instructions}
                </span>
                <button
                  onClick={() => deletePrescription(p.prescriptionId)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2 text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Medicine Name"
            value={prescription.medicineName}
            onChange={(e) => setPrescription({ ...prescription, medicineName: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Dosage"
            value={prescription.dosage}
            onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Duration"
            value={prescription.duration}
            onChange={(e) => setPrescription({ ...prescription, duration: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Instructions"
            value={prescription.instructions}
            onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })}
            className="border p-2 mb-4 w-full rounded"
          />
          <button onClick={addPrescription} className="bg-blue-600 text-white px-3 py-1 rounded mb-4">
            Add Prescription
          </button>

          <h4 className="text-md font-semibold mb-2 text-gray-700">Recommended Tests</h4>
          <ul className="mb-3 border p-2 rounded bg-gray-50">
            {testsList.length === 0 && <li className="text-sm text-gray-500">No tests yet.</li>}
            {testsList.map((t) => (
              <li key={t.testId} className="text-sm mb-1 flex justify-between items-center">
                <span>
                  {t.testName} – {t.reason} ({t.testDate})
                </span>
                <button
                  onClick={() => deleteTest(t.testId)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2 text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Test Name"
            value={test.testName}
            onChange={(e) => setTest({ ...test, testName: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Reason"
            value={test.reason}
            onChange={(e) => setTest({ ...test, reason: e.target.value })}
            className="border p-2 mb-2 w-full rounded"
          />
          <input
            type="date"
            value={test.testDate}
            onChange={(e) => setTest({ ...test, testDate: e.target.value })}
            className="border p-2 mb-4 w-full rounded"
          />
          <button onClick={addTest} className="bg-blue-600 text-white px-3 py-1 rounded mb-4">
            Add Test
          </button>

          <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-3 py-1 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  function renderAppointments() {
    return (
      <div>
        <h2 className="text-xl font-semibold  m-3 pb-3">Appointments</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Patient ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Symptoms</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.appointmentId}>
                <td className="border-black border-2">{a.patientId}</td>
                <td className="border-black border-2">{a.appointmentDate?.split("T")[0]}</td>
                <td className="border-black border-2">{a.status}</td>
                <td className="border-black border-2">{a.symptoms}</td>
                <td className="border-black border-2">
                  {a.status === "Scheduled" && (
                    <>
                      <button
                        onClick={() => updateAppointmentStatus(a.appointmentId, "Completed")}
                        className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(a.appointmentId, "Cancelled")}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {a.status === "Completed" && (
                    <button onClick={() => openConsultation(a)} className="bg-blue-500 text-white px-2 py-1 rounded">
                      Consult
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!doctor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-blue-700">Doctor</h2>
          <button onClick={() => setActiveTab("appointments")} className="block w-full mb-2 p-2 hover:bg-gray-400 transition-all delay-100">
            Appointments
          </button>
          <button onClick={() => setActiveTab("records")} className="block w-full mb-2 p-2  hover:bg-gray-400 transition-all delay-100">
            Medical Records
          </button>
        </div>
        <div className="mt-auto">
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded w-full">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeTab === "appointments" && renderAppointments()}
        {activeTab === "records" && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Medical Records</h2>
            <ul>
              {records.map((r) => (
                <li key={r.recordId} className="border p-2 mb-2 rounded">
                  Patient {r.patientId} – {r.diagnosis} ({r.recordDate})
                </li>
              ))}
            </ul>
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

      {showModal && renderConsultationModal()}
    </div>
  );
}
