import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx"
import Login from "./pages/Login";
import Sidebar from "./sidebar/Sidebar.js";
import GenerateReports from "./pages/GenerateReports.jsx";
import AdminPatientDashBoard from "./pages/dashboard/AdminPatientDashBoard.jsx";
import AdminDoctorDashboard from "./pages/dashboard/AdminDoctorDashboard.jsx";
import Appointments from "./pages/Appointments.jsx";

export default function App() {
  return (
    // <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/generateReports" element={<GenerateReports />} />
          <Route path="/admin/patients" element={<AdminPatientDashBoard />} />
          <Route path="/admin/doctors" element={<AdminDoctorDashboard/>}/>
          <Route path="/appointments" element={<Appointments />}/>
        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  //  <div  className="">
  //     {/* <Login /> */}
  //     {/* <Sidebar /> */}
  //     <AdminDashboard />
  //  </div> 
  );
}
