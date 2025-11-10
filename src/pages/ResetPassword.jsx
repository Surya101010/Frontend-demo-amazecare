import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function resetPassword() {
    if (!email) {
      alert("Invalid request. Email not found.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8081/forgot-password/reset?email=${email}&newPassword=${newPassword}`
      );
      alert("Password reset successful. Please log in.");
      navigate("/");
    } catch (e) {
      alert("Failed to reset password. Try again.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          onClick={resetPassword}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
