import { useState, useEffect } from "react";

export function useAuth() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
    userId: localStorage.getItem("userId"),
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        username: localStorage.getItem("username"),
        userId: localStorage.getItem("userId"),
      });
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  return {
    isAuthenticated: !!auth.token,
    token: auth.token,
    role: auth.role,
    username: auth.username,
    userId: auth.userId,
  };
}
