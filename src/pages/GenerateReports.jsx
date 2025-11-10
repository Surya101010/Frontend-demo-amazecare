import React, { useRef, useState } from "react";
import Button from "../components/Button";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import GenerateReportsCard from "../cards/GenerateReportsCard";
import SidebarIcon from "../Icons/SidebarIcon";
import SideBarButton from "../components/SideBarButton";
import { useNavigate } from "react-router";
import LogoutButton from "../components/Logout";
import { UserCircle } from "lucide-react";
import UserProfile from "../components/UserProfile";

function GenerateReports() {
  const [data, setData] = useState([]);
  const nav1 = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const userId = localStorage.getItem("userId");

  async function generate() {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BACKEND_URL}api/medicalrecords`, {
      headers: { Authorization: "Bearer " + token },
    });
    setData(response.data);
  }

  return (
    <div className="flex relative w-full">
      <div className="h-screen w-64 border bg-slate-100">
        <div className="p-4">
          <SidebarIcon />
        </div>
        <div className="m-4">
          <SideBarButton
            text={"Manage Patients "}
            onclick={() => {
              nav1("/admin/patients");
            }}
          />
        </div>
        <div className="m-4">
          <SideBarButton
            text={"Manage Doctors "}
            onclick={() => {
              nav1("/admin/doctors");
            }}
          />
        </div>
        <div className="m-4">
          <SideBarButton
            text={"Manage Appointments "}
            onclick={() => {
              nav1("/appointments");
            }}
          />
        </div>
        <LogoutButton />
      </div>

      
      <div className="flex-1 flex flex-col pl-4 pr-4">
        <div className="flex justify-center items-center p-4">
          <Button text={"Generate reports"} onclick={generate} />
        </div>
        <GenerateReportsCard records={data} />
      </div>

      
      <div className="fixed top-5 right-8 z-40 cursor-pointer">
        <UserCircle
          size={36}
          className="text-blue-600 hover:text-blue-800 transition-all"
          onClick={() => setShowProfile(true)}
        />
      </div>

      
      {showProfile && (
        <div className="fixed top-0 right-0 z-50">
          <UserProfile userId={userId} onClose={() => setShowProfile(false)} />
        </div>
      )}
    </div>
  );
}

export default GenerateReports;
