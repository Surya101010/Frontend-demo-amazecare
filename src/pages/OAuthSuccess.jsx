import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    const role = params.get("role");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      if (role) localStorage.setItem("role", role);
      if (email) localStorage.setItem("email", email);

      setTimeout(() => {
        navigate("/patient/dashboard", { replace: true });
      }, 300);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Logging you in securely via Google...</p>
    </div>
  );
}
