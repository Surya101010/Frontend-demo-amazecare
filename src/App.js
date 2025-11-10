import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleBasedRoute from "./auth/RoleBasedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import GenerateReports from "./pages/GenerateReports.jsx";
import AdminPatientDashBoard from "./pages/dashboard/AdminPatientDashBoard.jsx";
import AdminDoctorDashboard from "./pages/dashboard/AdminDoctorDashboard.jsx";
import AppointmentDashboard from "./pages/dashboard/AppointmentDashBoard.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PatientDashboard from "./pages/dashboard/PatientDashBoard.jsx";
import DoctorDashboard from "./pages/dashboard/DoctorDashBoard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/reg" element={<Register />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />}/>
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/generateReports" element={<GenerateReports />} />
            <Route path="/admin/patients" element={<AdminPatientDashBoard />} />
            <Route path="/admin/doctors" element={<AdminDoctorDashboard />} />
            <Route path="/appointments" element={<AppointmentDashboard />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
