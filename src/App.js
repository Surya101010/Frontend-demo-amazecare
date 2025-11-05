import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx"
import Login from "./pages/Login";
import Sidebar from "./sidebar/Sidebar.js";
import GenerateReports from "./pages/GenerateReports.jsx";

// function Dashboard() {
//   return <h1 className="text-2xl text-center mt-10">Welcome to AmazeCare Dashboard!</h1>;
// }

export default function App() {
  return (
    // <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/generateReports" element={<GenerateReports />} />
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
