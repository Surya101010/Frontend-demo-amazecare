import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BACKEND_URL } from "../Config";
import { useNavigate } from "react-router";
import Input from "../components/Input";
import Button from "../components/Button";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[A-Za-z0-9]+$/, "Username can have no spaces or special characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters")
    .regex(/^\S+$/, "Password cannot contain spaces"),
});

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data) {
    try {
      const response = await axios.post(`${BACKEND_URL}authenticate`, data);
      const { token, username, role, userId, email } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", email);

      if (role === "ROLE_ADMIN") {
        navigate("/dashboard");
      } else if (role === "ROLE_DOCTOR") {
        try {
          const doctorResponse = await axios.get(`${BACKEND_URL}api/doctors/email`, {
            params: { email },
            headers: { Authorization: `Bearer ${token}` },
          });

          localStorage.setItem("doctorId", doctorResponse.data.doctorId);
          navigate("/doctor/dashboard");
        } catch (error) {
          if (error.response?.status === 404) {
            alert("Doctor profile not found for this email");
          } else {
            alert("Error fetching doctor profile");
            console.error(error);
          }
        }
      } else if (role === "ROLE_PATIENT") {
        navigate("/patient/dashboard");
      }
    } catch (error) {
      if (error.response?.status === 500) {
        alert("User not available (Server error 500)");
      } else if (error.response?.status === 401) {
        alert("Invalid credentials");
      } else {
        alert("Unexpected error occurred");
      }
      console.error("Login error:", error);
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}oauth2/authorization/google`;
  };

  return (
    <div className="h-screen w-screen fixed bg-slate-100 flex flex-col justify-center items-center">
      <h1 className="font-extrabold text-blue-400 text-5xl mb-10">AmazeCare</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 bg-white border-4 border-blue-200 shadow-xl rounded-lg w-80"
      >
        <Input placeholder="Enter the username" type="text" {...register("username")} />
        {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}

        <Input placeholder="Enter the password" type="password" {...register("password")} />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

        <Button
          type="submit"
          text={isSubmitting ? "Signing in..." : "Submit"}
          disabled={isSubmitting}
        />

        <p className="text-center text-sm mt-3">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/reg")} className="text-blue-600 cursor-pointer">
            Register
          </span>
        </p>

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-blue-600 cursor-pointer text-center mt-3"
        >
          Forgot Password?
        </p>

        
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center gap-2 px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}
