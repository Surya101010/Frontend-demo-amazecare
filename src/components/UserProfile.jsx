import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import Button from "./Button";
import Input from "./Input";

export default function UserProfile({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => alert("Failed to fetch profile"));
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(`${BACKEND_URL}api/users/${userId}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BACKEND_URL}api/users/${userId}/change-password`,
        null,
        {
          params: passwords,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password updated successfully");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      alert("Failed to update password");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${BACKEND_URL}api/users/${userId}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile picture uploaded");
      window.location.reload();
    } catch {
      alert("Failed to upload image");
    }
  };

  if (!user) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-[400px] bg-white border-l shadow-2xl z-50 flex flex-col p-6 overflow-y-auto transition-transform duration-300"
      style={{ transform: "translateX(0%)" }}
    >
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-black text-2xl absolute top-3 right-4"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold text-blue-600 mb-4">User Profile</h2>

      <div className="flex flex-col items-center gap-3">
        <img
          src={
            user.profilePic
              ? `${BACKEND_URL.replace(/\/$/, "")}${user.profilePic}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full border shadow-sm object-cover"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 text-sm w-full"
        />
        <Button text="Upload Picture" onclick={handleUpload} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username || ""}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email || ""}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="phone"
          placeholder="Phone"
          value={user.phone || ""}
          onChange={handleChange}
        />
        <Button text={loading ? "Saving..." : "Save Changes"} onclick={handleSave} />
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-2">Change Password</h3>
        <Input
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, oldPassword: e.target.value })
          }
        />
        <Input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />
        <Button text="Change Password" onclick={handlePasswordChange} />
      </div>
    </div>
  );
}
